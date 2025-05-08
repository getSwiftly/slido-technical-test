const client = require("../../config/pg-client");
const { getIO } = require("../../config/socket");

class PollService {
  async createPoll(pollData) {
    try {
      const { question, options, expiresAt } = pollData;

      // Start a transaction
      await client.query('BEGIN');

      // Insert the poll
      const pollResult = await client.query(
        'INSERT INTO polls (question, expires_at) VALUES ($1, $2) RETURNING id',
        [question, expiresAt]
      );

      const pollId = pollResult.rows[0].id;

      // Insert all options
      const optionValues = options.map(option => `(${pollId}, '${option}')`).join(',');
      await client.query(
        `INSERT INTO poll_options (poll_id, option_text) VALUES ${optionValues}`
      );

      // Commit the transaction
      await client.query('COMMIT');

      return {
        status: 201,
        message: "Poll created successfully",
        data: {
          pollId
        }
      };
    } catch (error) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw error;
    }
  }

  async getPollById(pollId) {
    try {
      // Get poll details
      const pollResult = await client.query(
        `SELECT id, question, expires_at as "expiresAt", created_at as "createdAt", updated_at as "updatedAt"
         FROM polls 
         WHERE id = $1`,
        [pollId]
      );

      if (pollResult.rows.length === 0) {
        throw {
          status: 404,
          message: "Poll not found"
        };
      }

      // Get poll options with vote counts
      const optionsResult = await client.query(
        `SELECT 
          po.id, 
          po.option_text as "optionText",
          COUNT(pv.id) as "voteCount"
         FROM poll_options po
         LEFT JOIN poll_votes pv ON po.id = pv.option_id
         WHERE po.poll_id = $1
         GROUP BY po.id, po.option_text
         ORDER BY po.id`,
        [pollId]
      );

      // Get total votes for the poll
      const totalVotesResult = await client.query(
        `SELECT COUNT(*) as "totalVotes"
         FROM poll_votes
         WHERE poll_id = $1`,
        [pollId]
      );

      return {
        status: 200,
        message: "Poll retrieved successfully",
        data: {
          ...pollResult.rows[0],
          options: optionsResult.rows,
          totalVotes: parseInt(totalVotesResult.rows[0].totalVotes) || 0
        }
      };
    } catch (error) {
      throw {
        status: error.status || 500,
        message: error.message || "Error retrieving poll",
        error
      };
    }
  }

  async voteOnPoll(pollId, optionId, userId) {
    try {
      // Start a transaction
      await client.query('BEGIN');

      // Check if poll exists and is not expired
      const pollResult = await client.query(
        `SELECT id, question, expires_at 
         FROM polls 
         WHERE id = $1`,
        [pollId]
      );

      if (pollResult.rows.length === 0) {
        throw {
          status: 404,
          message: "Poll not found"
        };
      }

      const poll = pollResult.rows[0];
      const now = new Date();
      const expiresAt = new Date(poll.expires_at);

      if (now > expiresAt) {
        throw {
          status: 400,
          message: `This poll has expired on ${expiresAt.toISOString()}`
        };
      }

      // Check if option exists and belongs to the poll
      const optionResult = await client.query(
        `SELECT id 
         FROM poll_options 
         WHERE id = $1 AND poll_id = $2`,
        [optionId, pollId]
      );

      if (optionResult.rows.length === 0) {
        throw {
          status: 400,
          message: "Invalid option for this poll"
        };
      }

      // Try to insert the vote
      try {
        await client.query(
          `INSERT INTO poll_votes (poll_id, option_id, user_id)
           VALUES ($1, $2, $3)`,
          [pollId, optionId, userId]
        );
      } catch (error) {
        if (error.constraint === 'unique_user_poll_vote') {
          throw {
            status: 400,
            message: "You have already voted on this poll"
          };
        }
        throw error;
      }

      // Commit the transaction
      await client.query('COMMIT');

      const pollUpdate = await this.getPollById(pollId);
      console.log('pollUpdate', pollUpdate);
      // Emit vote update to the room
      try {
        console.log('sending vote update to room', );
        const io = getIO();
        const room = `poll/${pollUpdate.data.id}`;
        io.to(room).emit('pollUpdate', {
          message: pollUpdate.data,
          timestamp: new Date().toISOString()
        });
        console.log('vote update sent to room');
      } catch (error) {
        console.error('Error emitting vote update:', error);
        // Don't throw error here as the vote was successful
      }

      return {
        status: 200,
        message: "Vote recorded successfully"
      };
    } catch (error) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw {
        status: error.status || 500,
        message: error.message || "Error recording vote",
        error
      };
    }
  }
}

module.exports = new PollService(); 