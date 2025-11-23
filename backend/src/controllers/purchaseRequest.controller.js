const purchaseRequestService = require("../services/purchaseRequest.service");

const create = async (req, res) => {
    const payload = req.body;
    const newPurchaseRequest = await purchaseRequestService.create(payload);
    return res.status(201).json({
        status: "success",
        message: "Purchase Request created successfully",
        data: newPurchaseRequest,
    })
}

const getAll = async (_req, res) => {
    const purchaseRequests = await purchaseRequestService.getAll();
    return res.status(200).json({
        status: "success",
        message: "Purchase Requests retrieved successfully",
        data: purchaseRequests,
    });
}

const getById = async (req, res) => {
    const { id } = req.params;
    const purchaseRequest = await purchaseRequestService.getById(id);
    return res.status(200).json({
        status: "success",
        message: "Purchase Request retrieved successfully",
        data: purchaseRequest,
    });
}

const update = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedPurchaseRequest = await purchaseRequestService.update(id, payload);
    return res.status(200).json({
        status: "success",
        message: "Purchase Request updated successfully",
        data: updatedPurchaseRequest,
    });
}

const remove = async (req, res) => {
    const { id } = req.params;
    
    await purchaseRequestService.remove(id);
    return res.status(200).json({ message: "Purchase request deleted" });
}

module.exports = { create, getAll, getById, update, remove }