import React, { useEffect, useState } from 'react';
import EditCustomerForm from '../components/EditCustomerForm';
import OrderHistory from '../components/OrderHistory';


const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('customer'));
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (err) {
            console.error('Error parsing customer data:', err);
        }
    }, []);

    if (!user) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">

                <p className="text-lg mt-10">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="max-w-4xl mx-auto space-y-10 pt-10 px-4">
                <h2 className="text-3xl font-bold text-red-500">
                    Welcome, {user.firstName || 'Customer'}!
                </h2>

                <section className="profile-section">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <EditCustomerForm customer={user} />
                </section>

                <section className="profile-section">
                    <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
                    {user.userId ? (
                        <OrderHistory userId={user.userId} />
                    ) : (
                        <p className="text-sm text-gray-400">No user ID available for order history.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;
