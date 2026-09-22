import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  MdCheckCircle,
  MdCancel,
  MdLocalHospital,
  MdBadge,
  MdEmail,
  MdCalendarToday,
  MdClose,
  MdArrowBack
} from 'react-icons/md'

import Navbar from '../components/Navbar'
import API from '../api/axios'

// 👇 IMAGES (PUT IN /assets FOLDER)
import maleDoctor from '../assets/maleDoctor.png'
import femaleDoctor from '../assets/femaleDoctor.png'
import bannerImg from '../assets/doctorBanner.jpg'

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [openImage, setOpenImage] = useState(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await API.get('/admin/doctors/' + id)
        setDoctor(data)
      } catch (err) {
        toast.error('Doctor not found')
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
  }, [id])

  const handleAction = async (action) => {
    setActing(true)
    try {
      const { data } = await API.put('/admin/doctors/' + id + '/' + action)
      toast.success(data.message)

      setDoctor(prev => ({
        ...prev,
        status: action === 'accept' ? 'accepted' : 'rejected',
        canLogin: action === 'accept'
      }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setActing(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loading}>Loading doctor profile...</div>
      </div>
    )
  }

  if (!doctor) return null

  const statusColors = {
    pending: { bg: '#FEF3C7', color: '#D97706' },
    accepted: { bg: '#D1FAE5', color: '#065F46' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' }
  }

  const isPdf =
    doctor.certificateUrl?.includes('.pdf') ||
    doctor.certificateUrl?.includes('raw/upload')
    

  // 👇 AUTO IMAGE (male/female fallback)
  const doctorImage =
    doctor.gender === 'female' ? femaleDoctor : maleDoctor

  const fields = [
    { label: 'Full Name', value: doctor.name, Icon: MdBadge },
    { label: 'Email', value: doctor.email, Icon: MdEmail },
    {
      label: 'Speciality',
      value:
        doctor.speciality === 'Other'
          ? doctor.specialityCustom || 'Other'
          : doctor.speciality,
      Icon: MdLocalHospital
    },
    { label: 'Reg. Number', value: doctor.registrationNumber, Icon: MdBadge },
    {
      label: 'Applied On',
      value: new Date(doctor.createdAt).toLocaleDateString('en-IN'),
      Icon: MdCalendarToday
    }
  ]

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* BACK BUTTON (CLEAN) */}
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <MdArrowBack />
          Back
        </button>


        {/* HEADER (LINKEDIN STYLE) */}
        <div style={styles.headerCard}>
         

          <div style={styles.profileRow}>
            <img src={doctorImage} style={styles.avatar} />

            

            <div style={styles.info}>
              <div
  style={{
    display:'flex',
    gap:'12px',
    marginTop:'12px',
    flexWrap:'wrap'
  }}
>
  <div
    style={{
      background:'#F8FAFC',
      border:'1px solid #E5E7EB',
      padding:'8px 12px',
      borderRadius:'12px',
      fontSize:'13px'
    }}
  >
    Reg. No: {doctor.registrationNumber}
  </div>

  <div
    style={{
      background:'#F8FAFC',
      border:'1px solid #E5E7EB',
      padding:'8px 12px',
      borderRadius:'12px',
      fontSize:'13px'
    }}
  >
    Applied:
    {' '}
    {new Date(doctor.createdAt).toLocaleDateString('en-IN')}
  </div>
</div>
              <h1 style={styles.name}>{doctor.name}</h1>
              <p style={styles.sub}>{doctor.email}</p>

              <span style={{
                ...styles.badge,
                background: statusColors[doctor.status]?.bg,
                color: statusColors[doctor.status]?.color
              }}>
                {doctor.status}
              </span>
            </div>
          </div>
        </div>
        

        {/* DETAILS */}
        <div style={styles.grid}>
          {fields.map((f, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.iconBox}>
                <f.Icon />
              </div>
              <div>
                <div style={styles.label}>{f.label}</div>
                <div style={styles.value}>{f.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CERTIFICATE */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Medical Certificate</h3>

          {isPdf ? (
            <a href={doctor.certificateUrl} target="_blank" style={styles.pdfBtn}>
              View Certificate PDF
            </a>
          ) : (
            <div>
              <img
                src={doctor.certificateUrl}
                style={styles.certificate}
                onClick={() => setOpenImage(true)}
              />

              <button
                onClick={() => setOpenImage(true)}
                style={styles.viewBtn}
              >
                View Full Screen
              </button>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        {doctor.status === 'pending' ? (
          <div style={styles.actions}>
            <button onClick={() => handleAction('accept')} style={styles.accept}>
              <MdCheckCircle /> Accept
            </button>

            <button onClick={() => handleAction('reject')} style={styles.reject}>
              <MdCancel /> Reject
            </button>
          </div>
        ) : (
          <div style={styles.final}>
            {doctor.status.toUpperCase()}
          </div>
        )}

      </div>

      {/* IMAGE MODAL */}
      {openImage && (
        <div style={styles.modal} onClick={() => setOpenImage(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setOpenImage(false)}>
              <MdClose />
            </button>

            <img src={doctor.certificateUrl} style={styles.fullImage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDetail

/* ================= STYLES ================= */

const styles = {

page: {
  minHeight: '100vh',
  background: '#F8FAFC'
},
container: {
  marginLeft: '290px',
  padding: '32px 40px',
  maxWidth: '1200px'
},
  loading: {
    textAlign: 'center',
    padding: '80px',
    color: '#0f766e'
  },

backBtn: {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  borderRadius: '14px',
  border: '1px solid #E5E7EB',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'all .25s ease'
},

 headerCard: {
  background: '#FFFFFF',
  borderRadius: '24px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  marginBottom: '24px'
},

  banner: {
    height: '140px',
    overflow: 'hidden'
  },

  bannerImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

profileRow: {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  padding: '28px'
},
 avatar: {
  width: '96px',
  height: '96px',
  borderRadius: '20px',
  background: '#F8FAFC',
  border: '1px solid #E5E7EB'
},
  info: {
    flex: 1
  },

 name: {
  fontSize: '30px',
  fontWeight: '800',
  color: '#0F172A',
  marginBottom: '4px'
},

  sub: {
    color: '#64748b'
  },

badge: {
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: '700',
  marginTop: '10px'
},

grid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(2,1fr)',
  gap: '16px'
},

 card: {
  background: '#FFFFFF',
  padding: '20px',
  borderRadius: '18px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  display: 'flex',
  gap: '14px',
  transition: 'all .25s ease'
},

iconBox: {
  width: '50px',
  height: '50px',
  background: '#ECFDF5',
  color: '#1E9E74',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
},

  label: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: 700
  },

  value: {
    fontSize: '14px',
    fontWeight: 600
  },

section: {
  background: '#FFFFFF',
  marginTop: '24px',
  padding: '24px',
  borderRadius: '20px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
},
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    marginBottom: '10px'
  },

certificate: {
  width: '100%',
  maxHeight: '550px',
  objectFit: 'contain',
  borderRadius: '16px',
  border: '1px solid #E5E7EB',
  cursor: 'zoom-in'
},

viewBtn: {
  marginTop: '14px',
  padding: '12px 18px',
  borderRadius: '14px',
  border: '1px solid #1E9E74',
  background: '#ECFDF5',
  color: '#1E9E74',
  cursor: 'pointer',
  fontWeight: '700'
},

  pdfBtn: {
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: '10px',
    background: '#ecfdf5',
    border: '1px solid #0f766e',
    fontWeight: 700,
    textDecoration: 'none'
  },

  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },

accept: {
  flex: 1,
  padding: '15px',
  background: 'linear-gradient(135deg,#1E9E74,#35C7A3)',
  color: '#fff',
  border: 'none',
  borderRadius: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 10px 25px rgba(30,158,116,0.20)'
},

reject: {
  flex: 1,
  padding: '15px',
  background: '#fff',
  border: '1px solid #EF4444',
  color: '#EF4444',
  borderRadius: '16px',
  fontWeight: '700',
  cursor: 'pointer'
},

  final: {
    marginTop: '15px',
    textAlign: 'center',
    padding: '12px',
    background: '#e5e7eb',
    borderRadius: '10px',
    fontWeight: 800
  },

  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalBox: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90%'
  },

  fullImage: {
    maxWidth: '100%',
    maxHeight: '90vh',
    borderRadius: '10px'
  },

  closeBtn: {
    position: 'absolute',
    top: '-40px',
    right: 0,
    background: '#fff',
    border: 'none',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer'
  }
}