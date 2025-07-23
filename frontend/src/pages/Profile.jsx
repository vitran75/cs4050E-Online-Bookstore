import React, { useEffect, useState } from 'react';
import EditCustomerForm from '../components/EditCustomerForm';
import OrderHistory from '../components/OrderHistory';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Example: get customer from localStorage
    const storedUser = JSON.parse(localStorage.getItem("customer"));
    setUser(storedUser);
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>Hello, {user.firstName || 'Customer'}!</h2>

      <section className="profile-section">
        <h3>Personal Information</h3>
        <EditCustomerForm customer={user} />
      </section>

      <section className="profile-section">
        <h3>Your Orders</h3>
        <OrderHistory userId={user.userId} />
      </section>
    </div>
  );
};

export default Profile;
