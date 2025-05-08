/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create poll_votes table
  pgm.createTable("poll_votes", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true,
    },
    poll_id: {
      type: "integer",
      notNull: true,
      references: "polls",
      onDelete: "CASCADE"
    },
    option_id: {
      type: "integer",
      notNull: true,
      references: "poll_options",
      onDelete: "CASCADE"
    },
    user_id: {
      type: "text",
      notNull: true
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    }
  });

  // Add unique constraint to ensure one vote per user per poll
  pgm.addConstraint(
    "poll_votes",
    "unique_user_poll_vote",
    {
      unique: ["poll_id", "user_id"]
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("poll_votes");
}; 