import {
    deleteOrderById,
    deleteOrderDetailById, getAllOrderDetails,
    getAllOrders,
    getOrderById, getOrderDetailById,
    updateOrderByOrderId, updateOrderDetailById
} from "../database/database-manager-2.js";
import {StatusCodes} from "http-status-codes";


export async function getOrdersDetails(req, res) {
    try {
        const orderDetails = getAllOrderDetails();
        res.status(StatusCodes.OK).json(orderDetails);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve order details." });
    }
}

export async function deleteOrderDetails(req, res){
    const { orderDetailId } = req.params;
    try {
        const deleteResult = deleteOrderDetailById(orderDetailId);
        if (deleteResult > 0) {
            res.status(StatusCodes.OK).json({ message: "Order details deleted successfully." });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Order details not found." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete order details." });
    }
}

export async function patchOrderDetails(req, res) {
    const { orderDetailId } = req.params;
    const updateData = req.body;
    try {
        const updatedOrderDetails = updateOrderDetailById(orderDetailId, updateData);
        res.status(StatusCodes.OK).json(updatedOrderDetails);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update order details." });
    }
}

export async function getOrderDetails(req, res){
    const { orderId } = req.params;
    try {
        const orderDetails = getOrderDetailById(orderId);
        if (orderDetails) {
            res.status(StatusCodes.OK).json(orderDetails);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Order details not found." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve order details." });
    }
}

export async function deleteOrder(req, res) {
    const { orderId } = req.params;
    try {
        const deleteResult = await deleteOrderById(orderId);
        if (deleteResult > 0) {
            res.status(StatusCodes.OK).json({ message: "Order deleted successfully." });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete order." });
    }
}

export async function patchOrder(req, res) {
    const { orderId } = req.params;
    const updateData = req.body;
    try {
        const updatedOrder = await updateOrderByOrderId(orderId, updateData);
        res.status(StatusCodes.OK).json(updatedOrder);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update order." });
    }
}

export async function getOrder(req, res) {
    const {orderId} = req.params;
    try {
        const order = await getOrderById(orderId);
        if (order) {
            res.status(StatusCodes.OK).json(order);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({error: "Order not found."});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Failed to retrieve order."});
    }
}

export async function getListOfOrders(req, res) {
    try {
        const orders = await getAllOrders();
        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve orders." });
    }
}
