import React, { useEffect, useState, useCallback } from "react";
import { UserApi, OrderApi } from "../../utils/api";
import Loader from "react-loader";
import CancelButton from "../../components/CancelButton/CancelButton";
import SiteModal from "../../components/SiteModal/SiteModal";
import moment from 'moment';

const MyOrders = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                await updateOrders();
            } catch (e) { }
        })();
    }, []);

    const updateOrders = useCallback(() => {
        (async () => {
            setLoading(true);
            const result = await UserApi.orders();
            const _orders = result.data.data.filter(order => order.order != null).map(order => ({
                ...order.order,
                time: moment(order.date).format("hh:mm")
            }));
            setOrders(_orders);
            setLoading(false);
        })();
    });

    const handleCancel = useCallback(id => {
        (async () => {
            setLoading(true);
            await OrderApi.delete(id);
            setModalOpen(true);
            updateOrders();
        })();
    });

    return (
        <>
            <Loader loaded={!loading}>
                <MyOrderList orders={orders} onCancel={handleCancel} />
            </Loader>
            <SiteModal
                open={modalOpen}
                title="ההזמנות שלי"
                text="הזמנה בוטלה בהצלחה!"
                onClose={() => setModalOpen(false)}
            />
        </>
    );
};

const MyOrderList = ({ orders, onCancel }) => {
    if (!orders || !orders.length) {
        return 'לא נמצאו הזמנות';
    }

    return (
        <ul className="order-list">
            {orders.map((order, idx) => (
                <MyOrderItem key={idx} {...order} onCancel={onCancel} />
            ))}
        </ul>
    );
}

const MyOrderItem = ({ _id, qrcode, string, amount, onCancel, event, time }) => {
    return (
        <li className="my-order-item">
            <div>
                <div>
                    מס' סועדים: {amount}<br />
                    {string.date},{' '}{time}
                </div>
                <CancelButton onClick={() => onCancel(_id)} />
            </div>
            <img src={qrcode} />
        </li>
    );
};

export default MyOrders;