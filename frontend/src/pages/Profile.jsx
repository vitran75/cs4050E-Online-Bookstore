import React, { useEffect, useState } from 'react';
import EditCustomerForm from '../components/EditCustomerForm';
import OrderHistory from '../components/OrderHistory';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('customer'));
        setUser(storedUser);
    }, []);

    if (!user) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-neutral-900 text-white">
                <p className="text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-neutral-900 text-white px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-red-500">Welcome, {user.firstName || 'Customer'}!</h2>

                <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <EditCustomerForm customer={user} />
                </section>

                <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
                    <OrderHistory userId={user.userId} />
                </section>
            </div>
        </div>
    );
};

export default Profile;
