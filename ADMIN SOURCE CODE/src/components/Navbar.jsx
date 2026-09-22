import { useNavigate, useLocation } from 'react-router-dom'
import {
  MdLogout,
  MdPeople,
  MdHourglassEmpty,
  MdCheckCircle,
  MdCancel
} from 'react-icons/md'

const Navbar = ({ counts = {}, activeTab, setActiveTab }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'all',
      label: 'All Doctors',
      icon: <MdPeople />,
      count: counts.all || 0
    },
    {
      key: 'pending',
      label: 'Pending',
      icon: <MdHourglassEmpty />,
      count: counts.pending || 0
    },
    {
      key: 'accepted',
      label: 'Accepted',
      icon: <MdCheckCircle />,
      count: counts.accepted || 0
    },
    {
      key: 'rejected',
      label: 'Rejected',
      icon: <MdCancel />,
      count: counts.rejected || 0
    }
  ]

  return (
    <div
      style={{
        width: '270px',
        height: '100vh',
        position: 'fixed',
  background:'#FFFFFF',
borderRight:'1px solid #E5E7EB',
boxShadow:'none',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 100
      }}
    >
      <div>
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #F1F5F9'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <img
              src="https://res.cloudinary.com/dk2novgh2/image/upload/v1774185694/logo_xoaxud.png"
              alt="Logo"
              style={{ height: '42px' }}
            />

            

            <div>
              <h2
                style={{
                  margin: 0,
               color: '#1E9E74',
                  fontSize: '24px',
                  fontWeight: '800',
                  letterSpacing: '1px'
                }}
              >
                AAKRITI
              </h2>

              <p
                style={{
                  margin: 0,
                  color: '#94A3B8',
                  fontSize: '12px'
                }}
              >
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '18px' }}>
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                marginBottom: '10px',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow:
  activeTab === item.key
    ? '0 8px 20px rgba(30,158,116,0.20)'
    : 'none',
               background:
  activeTab === item.key
    ? 'linear-gradient(135deg,#1E9E74,#35C7A3)'
    
    : 'transparent',
    
                 
                color:
                  activeTab === item.key
                    ? '#fff'
                    : '#475569',
                transition: '0.2s'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {item.icon}
                {item.label}
              </div>

              <span
                style={{
  background:
    activeTab === item.key
      ? 'rgba(255,255,255,0.25)'
      : '#FFFFFF',
  color:
    activeTab === item.key
      ? '#fff'
      : '#1E9E74',
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: '700',
  minWidth: '28px',
  textAlign: 'center',
  border:
    activeTab === item.key
      ? 'none'
      : '1px solid #DDEEE8'
}}

onMouseLeave={(e) => {
  e.currentTarget.style.background = '#fff'
  e.currentTarget.style.color = '#EF4444'
}}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #F1F5F9'
        }}
      >



        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid #EF4444',
         background:'#FEF2F2',
            color: '#EF4444',
            fontWeight: '700',
            cursor: 'pointer',
            transition: '0.2s'
            
          }}
          onMouseEnter={(e)=>{
  e.currentTarget.style.background='#EF4444'
  e.currentTarget.style.color='#fff'
}}

onMouseLeave={(e)=>{
  e.currentTarget.style.background='#FEF2F2'
  e.currentTarget.style.color='#EF4444'
}}
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar