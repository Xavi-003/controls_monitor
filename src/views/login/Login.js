import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import {loginApi} from  '../../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const validationErrors = {};
    if (!email.trim()) {
      validationErrors.email = 'email is required.';
    }
    if (!password.trim()) {
      validationErrors.password = 'Password is required.';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      let payload = {
        email: email,
        password: password
      }
      const {success,data,message,error} = await loginApi(payload)
      console.log(success,data,message,error);
      
      if(success){
        navigate('/dashboard');
        localStorage.setItem('user', JSON.stringify(data));
      }
      if(message)alert(message)
      console.log('Login successful:', response.data);
      
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      // alert(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                      />
                    </CInputGroup>
                    {errors.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {errors.password && (
                      <p className="text-danger">{errors.password}</p>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
