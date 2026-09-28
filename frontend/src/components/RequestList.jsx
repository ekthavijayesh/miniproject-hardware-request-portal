const RequestList = ({ requests, isAdmin = false, onApprove, onReject }) => {
  if (!requests || requests.length === 0) {
    return <p>No requests found.</p>;
  }

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {isAdmin && <th>Requested By</th>}
          <th>Item</th>
          <th>Quantity</th>
          <th>Reason</th>
          <th>Urgency</th>
          <th>Status</th>
          <th>Remarks</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.id}>
            {isAdmin && <td>{r.users?.name || '—'}</td>}
            <td>{r.inventory_items?.name || '—'}</td>
            <td>{r.quantity}</td>
            <td>{r.reason}</td>
            <td>{r.urgency}</td>
            <td>{r.status}</td>
            <td>{r.admin_remarks || '—'}</td>
            {isAdmin && (
              <td>
                {r.status === 'pending' ? (
                  <>
                    <button onClick={() => onApprove(r.id)}>Approve</button>{' '}
                    <button onClick={() => onReject(r.id)}>Reject</button>
                  </>
                ) : (
                  '—'
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestList;