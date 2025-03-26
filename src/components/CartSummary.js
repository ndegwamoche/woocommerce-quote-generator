import { useEffect, useState } from "react";

const CartSummary = ({ shippingCost = 0, setLoading, setFinalTotal }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(wgrrData.ajax_url + "?action=fetch_cart_data", {
                    method: "GET",
                    headers: { "X-WP-Nonce": wgrrData.nonce }
                });
                const data = await response.json();

                if (data.success) {
                    const items = data.data.cart.map(item => ({
                        ...item,
                        price: extractPrice(item.price),
                        total: extractPrice(item.total)
                    }));

                    setCartItems(items);
                    setLoading(false);
                    const cartTotal = items.reduce((sum, item) => sum + item.total, 0);
                    setTotal(cartTotal);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, []);

    const extractPrice = (htmlPrice) => {
        const match = htmlPrice.match(/([\d,.]+)/);
        return match ? parseFloat(match[0].replace(",", "")) : 0;
    };

    const formatPrice = (amount) => amount.toLocaleString("en-US");

    // Calculate final total
    const finalTotal = total + shippingCost;

    useEffect(() => {
        setFinalTotal(finalTotal);
    }, [finalTotal, setFinalTotal]);

    return (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white text-center custom-bg">
                <h4 class="h5 mt-3 text-white">Your Cart</h4>
            </div>
            <div className="card-body">
                <ul className="list-group mb-3">
                    {cartItems.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <small className="mb-1 text-muted">
                                    {item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name}
                                </small><br />
                                <small className="text-muted">Qty: {item.quantity}</small>
                            </div>
                            <small className="fw-bold text-primary">KSh {formatPrice(item.total)}</small>
                        </li>
                    ))}



                    <li className="list-group-item d-flex justify-content-between bg-light border-0 mt-5">
                        <span className="fw-bold">Total</span>
                        <strong className="text-success fs-5">KSh {formatPrice(total)}</strong>
                    </li>
                </ul>
            </div>

            <style>
                {`
                    .custom-bg {
                        background-color: #212120 !important;
                    }
                `}
            </style>
        </div>
    );
};

export default CartSummary;
