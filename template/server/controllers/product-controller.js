import {
    deleteProductById,
    getAllProducts,
    getProductById, getProductPriceByOrderedProductId,
    updateProductById,
    updateProductStock,getTheMostReturnedProducts
} from "../database/database-manager-2.js";
import {StatusCodes} from "http-status-codes";
import * as path from "path";

export async function getProduct(req, res) {
    const { productId } = req.params;
    try {
        const product = await getProductById(productId);
        if (product) {
            res.status(StatusCodes.OK).json(product);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found." });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve product." });
    }
}

export async function getProductPrice(req, res) {
    console.log(req.params)
    const orderedProductId = req.params.productId;
    try {
        console.log(orderedProductId)
        const priceData = getProductPriceByOrderedProductId(orderedProductId);
        console.log(priceData)
        if (priceData) {
            res.json(priceData);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product price:', error);
        res.status(500).send('Internal server error');
    }
}

export async function getListOfProducts(req, res) {
    try {
        const products = await getAllProducts();
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve products." });
    }
}


export async function patchProduct(req, res) {
    const { productId } = req.params;
    const { inventoryStock } = req.body;
    try {
        const product = await getProductById(productId);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found." });
        }

        await updateProductStock(productId, inventoryStock);

        const updatedProducts = await getAllProducts();
        console.log(updatedProducts);

        res.status(StatusCodes.OK).json({ message: "Stock updated successfully." });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error." });
    }
}

export async function deleteProduct(req, res) {
    const { productId } = req.params;

        await deleteProductById(productId);
        res.status(StatusCodes.OK).json({ message: "Product deleted successfully." });


}

export async function uploadImage(req, res) {
    const {productId} = req.body.productId;
    const image = req.files.image;

    if (!productId || !image) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'ProductId and image are required.'});
    }

    const product = getProductById(productId);

    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({error: 'Product not found.'});
    }

    const uploadPath = path.join('uploads', image.name);

    await image.mv(uploadPath, (err) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Error while uploading the image.'});
        }

        updateProductById(productId, {imageURL: uploadPath});

        return res.status(StatusCodes.OK).json({message: 'Image uploaded and product updated successfully.'});
    });
}

export async function getMostReturnedProducts(req, res) {
    try {
        const products = await getTheMostReturnedProducts();
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve products." });
    }
}