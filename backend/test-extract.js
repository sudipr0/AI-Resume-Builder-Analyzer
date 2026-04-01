import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const testExtraction = async () => {
    try {
        const formData = new FormData();
        // Create a dummy text file to test the extraction endpoint
        fs.writeFileSync('temp-resume.txt', 'John Doe\nSoftware Engineer\nExperience:\n- Google (2020-2023)\nSkills: JavaScript, Node.js');
        
        formData.append('resumeFile', fs.createReadStream('temp-resume.txt'));

        console.log('Sending request...');
        const response = await fetch('http://localhost:5001/api/extract/resume', {
            method: 'POST',
            body: formData,
            // Skip auth for this quick local test if possible, or we need a token.
            // Let's rely on the fact we didn't add the `protect` middleware strictly if token missing, 
            // wait, we did add protect. We'll need to handle that or test from the frontend.
            // Let's test from frontend using the browser tool.
        });
        
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
// We'll just test via browser instead to ensure Auth works
console.log('Use browser tool');
