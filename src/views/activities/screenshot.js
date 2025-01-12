import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
} from '@coreui/react';
import { getScreenshot } from 'src/api/acttivities'; // Make sure this function is correctly implemented

const ScreenShot = () => {
    const [state, setState] = useState({
        clients: [],
        loading: false,
        error: null,
        page: 1, // Current page
        limit: 10, // Number of clients per page
        skip: 0, // Offset (skip = (page - 1) * limit)
        totalPages: 1, // Total pages for pagination
    });

    useEffect(() => {
        const fetchClients = async () => {
            setState((prevState) => ({ ...prevState, loading: true }));
            try {
                let requestBody = {
                    page: state.page,
                    limit: state.limit,
                    skip: state.skip
                }
                const { result, message, success, error } = await getScreenshot(requestBody); // Assuming `getClients` accepts page and limit
                console.log(result, message, success, error);

                if (success) {
                    setState((prevState) => ({
                        ...prevState,
                        clients: result.data,
                        totalPages: Math.ceil(result.count / state.limit), // Calculate totalPages based on count
                    }));
                }
                if (message && !success) alert(message);

            } catch (err) {
                setState((prevState) => ({ ...prevState, error: 'Failed to fetch clients' }));
            } finally {
                setState((prevState) => ({ ...prevState, loading: false }));
            }
        };

        fetchClients();
    }, [state.page, state.limit]); // Re-fetch when page or limit changes

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= state.totalPages) {
            setState((prevState) => ({ ...prevState, page: newPage, skip: (newPage - 1) * state.limit }));
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Clients List</strong>
                    </CCardHeader>
                    <CCardBody>
                        {state.loading && <div>Loading...</div>}
                        {state.error && <div>{state.error}</div>}
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">User Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {state.clients.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan={4}>No clients found</CTableDataCell>
                                    </CTableRow>
                                ) : (
                                    state.clients.map((client, index) => {
                                        const base64Image = `data:image/jpeg;base64,${client?.imageThumbnail}`;
                                        return (
                                            <CTableRow key={client.id}>
                                                <CTableHeaderCell scope="row">
                                                    {(state.page - 1) * state.limit + index + 1}
                                                </CTableHeaderCell>
                                                <CTableDataCell>{client.created_at}</CTableDataCell>
                                                <CTableDataCell>{client.id}</CTableDataCell>
                                                <CTableDataCell>{client.email}</CTableDataCell>
                                                <CTableDataCell>
                                                    <img
                                                        src={base64Image}
                                                        alt="Base64 Example"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                    />
                                                </CTableDataCell>
                                            </CTableRow>
                                        );
                                    })
                                )}

                            </CTableBody>
                        </CTable>
                        <div className="pagination">
                            <CButton
                                color="secondary"
                                disabled={state.page === 1}
                                onClick={() => handlePageChange(state.page - 1)}
                            >
                                Previous
                            </CButton>
                            <span>Page {state.page} of {state.totalPages}</span>
                            <CButton
                                color="secondary"
                                disabled={state.page === state.totalPages}
                                onClick={() => handlePageChange(state.page + 1)}
                            >
                                Next
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ScreenShot;
