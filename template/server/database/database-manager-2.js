import Database from "better-sqlite3";
import * as queries from '../database/database-queries.js'
import {
    assignRmaToControllerQuery,
    getLastRMA,
    getRmaDetailsQuery,
    selectControllerInfoByRMAId
} from '../database/database-queries.js'
import * as initData from '../database/init-data.js'

import {returnedProduct} from "../database/init-data.js";


let db;
try{
    db = new Database('my-shop-database')
    console.log('Database Initialised')
} catch(e){
    console.error('Error while initializing DB', e)
    throw e;
}

db.prepare(queries.createProductTable).run();
db.prepare(queries.createUserTable).run();
db.prepare(queries.createOrderTable).run();
db.prepare(queries.createOrderedProductTable).run();
db.prepare(queries.createReturnTable).run();
db.prepare(queries.createReturnedProductTable).run();


insertUsers();
insertProducts();
insertOrders();
insertOrderDetails();
insertRMA();
insertReturned();

import bcrypt from 'bcrypt';

async function insertUsers() {
    const countResult = db.prepare(queries.countUsers).get();
    const saltRounds = 10;
    if (countResult && countResult['count(email)'] === 0) {
        const insert = db.prepare(queries.createUser);
        for (const user of initData.usersData) {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            insert.run(user.userId, user.userName, user.email, hashedPassword, user.userRole);
        }
    }
}

function insertProducts(){
    const countResult = db.prepare(queries.countProducts).get();
    if(countResult['count(productId)'] === 0 ){
        const insert = db.prepare(queries.createProduct);
        for(const product of initData.productsData){
            insert.run(product.type, product.price, product.name, product.imageURL, product.productWeight, product.inventoryStock);
        }
    }
}

function insertOrders(){
    const countResult = db.prepare(queries.countOrders).get();
    if(countResult['count(orderId)'] === 0){
        const insert = db.prepare(queries.createOrder);
        for(const order of initData.ordersData){
            insert.run(order.orderId, order.userId, order.orderDate, order.totalPrice);
        }
    }
}

function insertOrderDetails(){
    const countResult = db.prepare(queries.countOrderDetails).get();
    if(countResult['count(orderId)'] === 0){
        const insert = db.prepare(queries.createOrderDetails);
        for(const order of initData.orderDetailsData){
            insert.run(order.orderedProductId, order.orderId, order.productId, order.quantity, order.unitPrice, order.priceAtTimeOfSale);
        }
    }
}

export function insertReturned(){
    const countResult = db.prepare(queries.countReturnedProducts).get();
    if(countResult['count(returnedProductId)'] === 0) {
        const insert = db.prepare(queries.createReturnedProduct);
        for (const returnedProductData of initData.returnedProduct) {
            insert.run(
                returnedProductData.orderedProductId,
                returnedProductData.RMAId,
                returnedProductData.returnedDate,
                returnedProductData.description,
                returnedProductData.weight,
                returnedProductData.statusProduct,
                returnedProductData.quantityToReturn,
                returnedProductData.imageData
            );
        }
    }
}

export function insertRMA(){
    const countResult = db.prepare(queries.countReturns).get();
    if(countResult['count(RMAId)'] === 0) {
        const insert = db.prepare(queries.createRma);
        for (const rma of initData.rmaData) {
            insert.run(rma.barcode, rma.statusRma, rma.credit);
        }
    }
}

export function insertUser(user){
    const insert = db.prepare(queries.createUser);
    console.log( user.userID +  user.userName +  user.email +  user.password +  user.userRole);
    insert.run(
        user.userID, user.userName, user.email, user.password, user.userRole
    );
}
export function insertRma(barcode, statusRma, credit) {
    const statement = db.prepare(queries.createRma);
    const result = statement.run(barcode, statusRma, credit);
    const rmaId = result.lastInsertRowid; // This is SQLite-specific; adjust for your DB
    return rmaId;
}

export function getLastRma() {
    const statement = db.prepare(getLastRMA);
    return statement.get();
}

export function insertReturnedProduct(orderedProductId, rmaId, formattedDate, description, weight, status, quantityToReturn, customerImage){
    const statement = db.prepare(queries.createReturnedProduct);
    statement.run(orderedProductId, rmaId, formattedDate, description, weight, status, quantityToReturn, customerImage);
}

export function getAllUsers() {
    return db.prepare(queries.selectAllUsers).all();
}
export function getNumberOfUsers() {
    return db.prepare(queries.countUsers).get();
}


export function getUserByEmail(email) {
    return db.prepare(queries.selectUserByEmail).get(email);
}

export function getUserById(userId) {
    return db.prepare(queries.selectUserById).get(userId);
}

export function deleteUserByEmail(email) {
    return db.prepare(queries.deleteUserByEmail).run(email);
}

export function deleteUserById(userId) {
    return db.prepare(queries.deleteUserById).run(userId);
}

export function updateUserByEmail(email, userData) {
    const { userId, updatedEmail, password, userRole, isAdmin } = userData;
    return db.prepare(queries.updateUserByEmail).run(userId, updatedEmail, password, userRole, isAdmin);
}

export function updateUserRoleById(userId, userData) {
    const { userRole } = userData;
    return db.prepare(queries.updateUserRoleById).run(userRole, userId);
}

export function getAllProducts() {
    return db.prepare(queries.selectAllProducts).all();
}

export function getProductById(productId) {
    return db.prepare(queries.selectProductById).get(productId);
}

export function deleteProductById(productId) {
    return db.prepare(queries.deleteProductById).run(productId);
}

export function updateProductById(productId, productData) {
    const { type, price, name, imageURL, productWeight, inventoryStock } = productData;
    return db.prepare(queries.updateProductById).run(type, price, name, imageURL, productWeight, inventoryStock, productId);
}

export function getAllOrders() {
    return db.prepare(queries.selectAllOrders).all();
}

export function getOrderByOrderId(orderId) {
    return db.prepare(queries.selectOrderById).get(orderId);
}
export function getOrderByUserId(orderId) {
    return db.prepare(queries.selectOrderByUserId).all(orderId);
}

export function deleteOrderById(orderId) {
    return db.prepare(queries.deleteOrderByOrderId).run(orderId);
}


export function updateOrderByOrderId(orderId, orderData) {
    const { userId, orderDate, totalPrice } = orderData;
    return db.prepare(queries.updateOrderByOrderId).run(userId, orderDate, totalPrice, orderId);
}

export function getOrderDetailById(orderId) {
    return db.prepare(queries.selectOrderDetailById).all(orderId);
}

export async function updateProductStock(productId, inventoryStock) {
    const updateStatement = db.prepare(queries.updateProductStockById);
    return updateStatement.run(inventoryStock, productId);
}
export function updateOrderDetailById(orderDetailId, orderDetailData) {
    const { orderId, productId, quantity } = orderDetailData;
    return db.prepare(queries.updateOrderDetailById).run(orderId, productId, quantity, orderDetailId);
}

export function deleteOrderDetailById(orderDetailId) {
    return db.prepare(queries.deleteOrderDetailById).run(orderDetailId);
}

export function getAllOrderDetails() {
    return db.prepare(queries.selectAllOrderDetails).all();
}

export function getOrderedProductsByOrderId(orderId){
    try {
        return db.prepare(queries.selectOrderedProducts).all(orderId);
    } catch (error) {
        console.error("Error in getOrderedProductsByOrderId:", error);
        throw error;
    }
}

export function getNumberOfRMA() {
    return db.prepare(queries.countReturns).get();
}

export function deleteRmaById(returnId) {
    return db.prepare(queries.deleteRmaById).run(returnId);
}

export function getAllRma() {

    return db.prepare(queries.selectAllRma).all();
}

export function getAllRmaById(Id) {
    return db.prepare(queries.selectAllReturnedProductById).all(Id);
}

export function getALlReturnedProducts(){
    return db.prepare(queries.selectAllReturnedProducts).all();
}

export function getALlReturnedProductsByRMAId(){
    return db.prepare(queries.selectAllReturnedProducts).get(RMAId);
}

export function deleteRMAOrderById(orderId) {
    return db.prepare(queries.deleteOrderByOrderId).run(orderId);
}

export function getStatusById(RMAId) {
    return db.prepare(queries.selectStatusById).get(RMAId);
}

export function getTotalPriceOfRMA(RMAId) {
    const query = `
        SELECT r.RMAId, SUM(op.unitPrice * rp.quantityToReturn) AS TotalReturnPrice
        FROM returnedProduct rp
        JOIN orderedProduct op ON rp.orderedProductId = op.orderedProductId
        JOIN returntable r ON rp.RMAId = r.RMAId
        WHERE r.RMAId = ?
        GROUP BY r.RMAId;
    `;
    return db.prepare(query).get(RMAId);
}

export function getCustomerEmailByRMAId(RMAId) {
    const statement = db.prepare(queries.selectCustomerEmailByRMAId);
    return statement.get(RMAId);
}
export function getControllerInfoByRMAId(RMAId) {
    const statement = db.prepare(selectControllerInfoByRMAId);
    return statement.get(RMAId);
}

export function getProductByRMAId(RMAId) {
    return db.prepare(queries.selectProductDescriptionsByRMAId).all(RMAId);
}
export function getTotalRefundByRMAId(RMAId) {
    const statement = db.prepare('SELECT totalRefundAmount FROM returntable WHERE RMAId = ?');
    return statement.get(RMAId);
}


export function getQunatityByRMAId(RMAId) {
    return db.prepare(queries.selectReturnedProductQuantityByRMAId).all(RMAId);
}


export function updateUserPasswordById(userId, newPassword) {
    const update = db.prepare(queries.updateUserPasswordById);
    return update.run(newPassword, userId);
}


export function getAllReturnsByUserId(userId){
    return db.prepare(queries.selectAllRMAByUserId).all(userId);
}

export function getRMAByClientEmail(email){
    return db.prepare(queries.selectAllRMAbyCustomersEmail).all(email);
}


export function getProductPriceByName(productName) {
    return db.prepare('SELECT price FROM product WHERE name = ?').get(productName);
}

export function increaseProductStockByName(productName, quantity) {
    const currentStock = db.prepare('SELECT inventoryStock FROM product WHERE name = ?').get(productName).inventoryStock;
    console.log(currentStock)
    console.log(quantity)
    const newStock = currentStock + quantity;
    const update = db.prepare('UPDATE product SET inventoryStock = ? WHERE name = ?');
    return update.run(newStock, productName);
}
export async function assignRmaToControllerDb(RMAId, controllerId) {
    const rmaDetails = db.prepare(getRmaDetailsQuery).get(RMAId);

    if (rmaDetails && rmaDetails.controllerId) {
        if (new Date() - new Date(rmaDetails.lockTimestamp) < 2 * 60 * 60 * 1000) {
            if (rmaDetails.controllerId === controllerId) {
                // Current user has the lock, so grant access.
                return { alreadyLockedByThisController: true };
            } else {
                // Another user has the lock.
                return { locked: true };
            }
        }
    }

    const timestamp = new Date().toISOString();
    const updateResult = await db.prepare(assignRmaToControllerQuery).run(controllerId, timestamp, RMAId);
    return updateResult;
}

export function returnAllRmaDetails() {
    return db.prepare(queries.getAllRmaDetails).all();
}


export function returnRMAaandDates() {
    try {
        const result = db.prepare(queries.getRMAandDATE).all();
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error executing the query:", error.message);
        throw error;
    }
}

export function returnRMAPerMonth() {
    try {
        return db.prepare(queries.getRMACountByMonth).all();
    } catch (error) {
        console.error("Error executing the query:", error.message);
        throw error;
    }
}


export function updateReturnedProductQuantity(productName, deductionQuantity, RMAId) {
    const select = db.prepare(`
        SELECT rp.quantityToReturn, rp.returnedProductId
        FROM returnedProduct rp
        JOIN orderedProduct op ON rp.orderedProductId = op.orderedProductId
        JOIN product p ON op.productId = p.productId
        JOIN returntable r ON rp.RMAId = r.RMAId
        WHERE p.name = ? AND r.RMAId = ?;
    `);
    const returnedProduct = select.get(productName, RMAId);
    console.log(returnedProduct)
    console.log(deductionQuantity)
    console.log("1")

    if (returnedProduct) {
        const newQuantity = Math.max(0, returnedProduct.quantityToReturn - deductionQuantity);
        console.log(newQuantity)
        const update = db.prepare('UPDATE returnedProduct SET quantityToReturn = ? WHERE returnedProductId = ?');
        return update.run(newQuantity, returnedProduct.returnedProductId);
    } else {
        throw new Error('Returned product not found');
    }
}

export function updateTotalRefundAmount(RMAId, totalRefundAmount) {
    console.log("here")
    const update = db.prepare('UPDATE returntable SET totalRefundAmount = ? WHERE RMAId = ?');
    return update.run(totalRefundAmount, RMAId);
}


export function getOrderDetails2(userId){
    return db.prepare(queries.getUserOrdersWithReturn).all(userId);
}


export function updateImageDescriptionBycollector(collectorImage, collectorDescription, returnedProductId) {
    const update = db.prepare(queries.setImageDescriptionByController);
    return update.run(collectorImage, collectorDescription,  returnedProductId);
}

export function getProductPriceByOrderedProductId(orderedProductId) {
    const query = `SELECT unitPrice FROM orderedProduct WHERE orderedProductId = ?`;
    return db.prepare(query).get(orderedProductId);
}

export function getCollectorImageAndDescriptionById(returnedProductId) {
    const statement = db.prepare(queries.selectCollectorImageAndDescriptionById);
    return statement.get(returnedProductId);
}

export function updateRMAStatus(RMAId, statusRma){
    const update = db.prepare('UPDATE returntable SET statusRma = ? WHERE RMAId = ?');
    const update2 = db.prepare('UPDATE returnedProduct SET statusProduct = ? WHERE RMAId = ?');
    update2.run(statusRma,RMAId)
    return update.run(statusRma, RMAId);
}

export function getTheMostReturnedProducts() {
    console.log(db.prepare(queries.selectMostReturnedProducts).all());
    return db.prepare(queries.selectMostReturnedProducts).all();
}

export function getDescriptionForRma(returnedProductId){
    return db.prepare(queries.selectAllRMADescriptionPerProducts).get(returnedProductId);

}