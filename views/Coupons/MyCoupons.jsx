import React, { useEffect, useState, useCallback } from "react";
import { UserApi } from "../../utils/api";
import Loader from "react-loader";
import Box from "../../components/Box/Box";
import moment from 'moment';

const MyCoupons = () => {
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                await updateCoupons();
            } catch (e) { }
        })();
    }, []);

    const updateCoupons = useCallback(() => {
        (async () => {
            setLoading(true);

            const result = await UserApi.vouchers();
            const _coupons = result.data.data
                .filter(coupon => coupon.voucher != null)
                .map(coupon => {

                    let dateStr = moment(`${coupon.voucher.date}`, 'YYYYMMDD').format("DD/MM/YYYY");
                    if (dateStr.toLowerCase() === "invalid date") {
                        dateStr = moment(coupon.voucher.date).format("DD/MM/YYYY");
                    }
                    return {
                        ...coupon.voucher,
                        dateStr
                    };
                });
            setCoupons(_coupons);
            console.log(_coupons);
            setLoading(false);
        })();
    });

    return (
        <>
            <Box>
                <Loader loaded={!loading}>
                    <MyCouponsList coupons={coupons} />
                </Loader>
            </Box>
        </>
    );
};

const MyCouponsList = ({ coupons }) => {
    if (!coupons || !coupons.length) {
        return 'לא נמצאו שוברים';
    }

    return (
        <ul className="coupon-list">
            {coupons.map((coupon, idx) => (
                <MyCouponItem key={idx} {...coupon} />
            ))}
        </ul>
    );
}

const MyCouponItem = ({ qrcode, value, dateStr }) => {
    return (
        <li className="my-coupon-item">
            <div>
                <div>
                    {value}, {dateStr}
                </div>
            </div>
            <div>
                <img src={qrcode} />
            </div>
        </li>
    );
};

export default MyCoupons;