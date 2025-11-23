const { Warehouse } = require("../../models");

const getAllWarehouses = async (_req, res) => {
    const warehouses = await Warehouse.findAll();
    return res.status(200).json({
        status: "success",
        message: "Warehouses retrieved successfully",
        data: warehouses,
    });
}

module.exports = { getAllWarehouses }