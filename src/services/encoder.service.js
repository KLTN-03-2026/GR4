const fs = require('fs');
const path = require('path');

const JOB_FILE = path.resolve(__dirname, '..', '..', 'jobs.json');
console.log('[encoder.service] JOB_FILE', JOB_FILE);

function addEncodeJob(data) {
  try {
    if (!fs.existsSync(JOB_FILE)) {
      console.log('[encoder.service] jobs.json không tồn tại, tạo mới');
      fs.writeFileSync(JOB_FILE, '[]', 'utf8');
    }

    const jobs = JSON.parse(fs.readFileSync(JOB_FILE, 'utf8'));

    const job = {
      file: data.file,
      movieId: data.movieId,
      createdAt: new Date().toISOString(),
    };

    jobs.push(job);
    fs.writeFileSync(JOB_FILE, JSON.stringify(jobs, null, 2), 'utf8');

    console.log('✅ Added job:', job);
    return job;
  } catch (err) {
    console.error('❌ Add job lỗi:', err);
    throw err;
  }
}

module.exports = { addEncodeJob };