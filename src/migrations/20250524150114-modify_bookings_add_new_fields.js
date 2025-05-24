'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn(
      'Bookings',//* table name to which you are adding
      'noOfSeats',//* new column name
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    );
    await queryInterface.addColumn(
      'Bookings',//* table name to which you are adding
      'totalCost',//* new column name
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    //* adding this is in down as well to ensure that if we remove the migration, this automatically removes these columns as well
    await queryInterface.removeColumn('Bookings', 'noOfSeats');
    await queryInterface.removeColumn('Bookings', 'totalCost');
  }
};
