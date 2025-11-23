const { Product } = require("../../models");

const getAllProducts = async (_req, res) => {
    const products = await Product.findAll();
    return res.status(200).json({
        status: "success",
        message: "Products retrieved successfully",
        data: products,
    });
}

module.exports = { getAllProducts }