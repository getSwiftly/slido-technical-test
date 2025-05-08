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
  // Add foreign key constraint
  pgm.addConstraint(
    'poll_votes',
    'fk_poll_votes_poll_id',
    {
      foreignKeys: {
        columns: 'poll_id',
        references: 'polls(id)',
        onDelete: 'CASCADE'
      }
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Remove foreign key constraint
  pgm.dropConstraint('poll_votes', 'fk_poll_votes_poll_id');
}; 