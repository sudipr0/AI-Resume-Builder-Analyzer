import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAutoSave } from '../../hooks/useAutoSave';
import api from '../../services/api';
import BuilderForm from '../../components/builder/BuilderForm'; // You must have this or replace with your form

const defaultData = {
    personal: { firstName: '', lastName: '', title: '', email: '', phone: '', location: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    template: 'modern',
    atsScore: 0,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const ResumeBuilder = () => {
    const { id } = useParams(); // undefined = new resume
    const navigate = useNavigate();
    const [data, setData] = useState(defaultData);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
    const [isLoading, setIsLoading] = useState(!!id); // only load if editing existing
    const hasCreated = useRef(false);

    // auto-save hook
    useAutoSave(id, data, setSaveStatus);

    useEffect(() => {
        if (!id) return; // NEW resume — skip loading entirely
        setIsLoading(true);
        api.get(`/resumes/${id}`)
            .then(res => setData(res.data))
            .catch(() => {
                // if resume not found, start fresh
                navigate('/builder/new', { replace: true });
            })
            .finally(() => setIsLoading(false));
    }, [id, navigate]);

    // Final save on "Finish" button
    const handleFinish = async () => {
        try {
            setSaveStatus('saving');
            const payload = { ...data, status: 'complete', updatedAt: new Date().toISOString() };
            if (id) {
                await api.put(`/resumes/${id}`, payload);
            } else {
                const res = await api.post('/resumes', payload);
                navigate(`/dashboard`, { state: { newResumeId: res.data._id } });
                return;
            }
            setSaveStatus('saved');
            navigate('/dashboard');
        } catch (err) {
            setSaveStatus('error');
            alert('Save failed. Your draft is backed up locally.');
        }
    };

    // show loading ONLY when fetching existing resume
    if (isLoading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p>Loading resume...</p>
        </div>
    );

    return (
        <div>
            {/* Save status indicator */}
            <div className="save-indicator">
                {saveStatus === 'saving' && '● Saving...'}
                {saveStatus === 'saved' && '✓ Saved'}
                {saveStatus === 'error' && '⚠ Save failed — backed up locally'}
            </div>
            {/* your builder form here */}
            <BuilderForm data={data} onChange={setData} />
            <button onClick={handleFinish}>Finish & save to profile</button>
        </div>
    );
};

export default ResumeBuilder;
