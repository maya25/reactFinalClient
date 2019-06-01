import React, { useState, useContext, useEffect, useCallback } from "react";
import "./Coupons.scss";
import { coupons, qrCode } from "./consts";
import Box from "../../components/Box/Box";
import UserStore from "../../stores/UserStore";
import Loader from 'react-loader';
import { VoucherApi } from "../../utils/api";
import moment from 'moment';
import SiteModal from "../../components/SiteModal/SiteModal";
import { Redirect } from "react-router-dom";

export const Coupons = ({ mealId, date }) => {
    const [qrCode, setQrCode] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState('ארוחה זו כבר הוזמנה או שהקופון כבר מומש');
    const [loading, setLoading] = useState(false);
    const userStore = useContext(UserStore);
    const { user } = userStore.user;

    const handleCouponClick = useCallback(name => {
        (async () => {
            setLoading(true);
            try {
                const result = await VoucherApi.add(mealId, user._id, moment(date).format('YYYYMMDD'), name);
                const coupon = result.data.data;
                setQrCode(coupon.qrcode);
                setShowQrCode(true);
            } catch (e) {
                setModalOpen(true);
            }

            setLoading(false);
        })();
    })

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [loading])

    if (redirect) {
        return <Redirect to="/" />;
    }

    if (showQrCode) {
        return (
            <Box>
                <QrCode qrImage={qrCode} />
            </Box>
        )
    }

    return (
        <Loader loaded={!loading}>
            <div className="disclaimer">
                <Box>
                    <p>
                        אורח יקר,
                  <br />
                        לצערנו לא היה מקום בארוחה אליה רצית לשריין מקום כפיצוי, אנא בחר שובר לארוחה במלון. השירות הוא ללא עלות. השובר תקף למימוש ליום הארוחה אליה ניסית להזמין מקום ולפי מספר הנפשות בהזמנה.
                </p>
                </Box>
            </div>
            <Box>
                <CouponsList items={coupons} onItemClick={handleCouponClick} />
            </Box>
            <SiteModal
                open={modalOpen}
                text={modalText}
                title="עמוד שוברים"
                onClose={() => setRedirect(true)}
            />
        </Loader>
    )
}

const CouponsList = ({ items, onItemClick }) => (
    <ul className="coupons-list">
        {items.map((item, idx) => <CouponsItem key={idx} {...item} onClick={onItemClick} />)}
    </ul>
)

const CouponsItem = ({ title, location, bgImage, onClick, id }) => (
    <li className="coupons-item">
        <h3 className="coupons-item-title">{title}</h3>
        <div
            className="coupons-item-content"
            style={{ backgroundImage: `url(${bgImage})` }}
            onClick={() => onClick(id)}
        >
            <label className="coupons-item-location">{location}</label>
        </div>
    </li>
)

const QrCode = ({ qrImage }) => (
    <div className="qr-code">
        <Box>
            <h3 className="qr-code-title">{qrCode.title}</h3>
            <div className="qr-code-image-wrapper">
                <img src={qrImage} className="qr-code-image" alt="qr code" />
            </div>
            <div>
                <p className="qr-code-disclaimer">{qrCode.disclaimer}</p>
            </div>
        </Box>
    </div>
);

export default Coupons;
