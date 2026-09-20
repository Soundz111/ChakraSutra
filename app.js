const moodMap = {
  Sad: { routine: 'Gentle stretching, breathwork, and deep relaxation', guidance: 'Soft flute and calm support for a steady, easing session.' },
  Worried: { routine: 'Grounding poses and slow breath cues', guidance: 'This flow is calming, steady, and reassuring.' },
  Stressed: { routine: 'Neck and upper-back release with a short flow', guidance: 'Keep the session short and quiet.' },
  Irritated: { routine: 'Controlled movement and grounding flow', guidance: 'Focus on one breath and one movement at a time.' },
  Normal: { routine: 'Balanced beginner flow with steady mobility', guidance: 'A balanced practice keeps your rhythm strong and calm.' },
  Energetic: { routine: 'Sunrise flow and dynamic activation', guidance: 'A brighter rhythm with mindful energy and power.' },
  Tired: { routine: 'Light mobility and restorative breathing', guidance: 'Keep the practice short and restorative.' }
};

const safetyMap = {
  Green: { title: 'Beginner Safe Flow', list: ['5-minute breathing + shoulder mobility', 'Gentle standing poses', 'Focus on kneecap alignment and posture'] },
  Yellow: { title: 'Modified Mobility Flow', list: ['Shorter practice with more guided pauses', 'Avoid deep knee bends and long holds', 'Use chair-friendly variations where needed'] },
  Orange: { title: 'Gentle Recovery Plan', list: ['Breathing with low-intensity movement', 'No deep flexion or twisting', 'Professional clearance recommended'] },
  Red: { title: 'Medical Review Required', list: ['Pause exercise and consult care professional', 'No active yoga practice until clearance', 'Prioritize rest, hydration, and comfort'] }
};

const languagePhrases = {
  Tamil: { red: 'டேய் தம்பி, தப்பு பண்றடா.', yellow: 'பத்தாது, பத்தாது.', green: 'சூப்பர் யானி.' },
  Hindi: { red: 'अरे भाई, गलत हो रहा है.', yellow: 'बस, बस… थोड़ा और.', green: 'बिल्कुल सही, मज़ा आ गया.' },
  English: { red: 'A bit off — adjust the knee more.', yellow: 'Almost there — just a small tweak.', green: 'Perfect. Hold the pose and breathe.' },
  Telugu: { red: 'అబ్బో, తప్పు దిశలో వుంది.', yellow: 'చాలా తక్కువే… ఇంకొంచెం.', green: 'చాలా బాగుంది, అలాగే ఉంచండి.' }
};

const $ = (id) => document.getElementById(id);
const moodButtons = document.querySelectorAll('.mood-btn');
const languageSelect = $('language');
const coachingStyle = $('coachingStyle');
const kneeAngleInput = $('kneeAngle');
const poseStage = $('poseStage');
const togglePracticeBtn = $('togglePracticeBtn');
let practiceTimer;
let elapsedSeconds = 0;
let cameraStream;

function setGlobalBackground(state) {
  const themes = {
    Red: ['#241525', '#061b35', 'rgba(255, 126, 126, .20)'],
    Yellow: ['#2c291c', '#071d39', 'rgba(255, 218, 113, .18)'],
    Green: ['#102b2b', '#071d39', 'rgba(113, 244, 177, .18)'],
    Neutral: ['#061a35', '#0d2144', 'rgba(108, 227, 255, .12)']
  };
  const colors = themes[state] || themes.Neutral;
  document.body.style.background = `radial-gradient(circle at 80% 5%, ${colors[2]}, transparent 34%), linear-gradient(135deg, ${colors[0]}, ${colors[1]} 58%, #071624)`;
  document.documentElement.style.setProperty('--feedback-glow', colors[2]);
}

function setSafetyState(level) {
  const meta = safetyMap[level];
  $('safetyPill').textContent = level;
  $('planTitle').textContent = meta.title;
  $('planList').innerHTML = meta.list.map((item) => `<li>${item}</li>`).join('');
  const color = level === 'Green' ? '#75f2b0' : level === 'Yellow' ? '#fced9a' : level === 'Orange' ? '#f7b76e' : '#f58e8b';
  $('safetyPill').style.color = color;
  $('safetyPill').style.background = `${color}20`;
  setGlobalBackground(level === 'Orange' ? 'Yellow' : level);
}

function updateRecommendation() {
  const mood = document.querySelector('.mood-btn.active')?.dataset.mood || 'Normal';
  const data = moodMap[mood];
  $('recommendationBox').innerHTML = `<strong>Recommended flow:</strong><p>${data.routine}. ${data.guidance}</p>`;
  const hot = $('weatherCard').textContent.toLowerCase().includes('hot');
  $('hydrationTip').textContent = hot ? 'Today is hot and humid. Keep water nearby before practice.' : 'A gentle sip before and after practice will help you stay fresh.';
  $('mealTip').textContent = hot ? 'Breakfast: idli + sambar + fruit. Midday: tender coconut water.' : 'Balanced meal with dal, vegetables, and fruit suits your wellness goal.';
  updatePoseFeedback();
}

function updatePoseFeedback() {
  const angle = Number(kneeAngleInput.value);
  $('angleValue').textContent = `${angle}°`;
  const selected = languagePhrases[languageSelect.value] || languagePhrases.Tamil;
  let state = 'Red';
  let background = 'rgba(255, 146, 146, .22)';
  let color = '#f58e8b';
  let phrase = selected.red;
  if (angle >= 80) {
    state = 'Green'; background = 'rgba(118, 255, 182, .22)'; color = '#75f2b0'; phrase = selected.green;
  } else if (angle >= 60) {
    state = 'Yellow'; background = 'rgba(255, 228, 142, .2)'; color = '#fced9a'; phrase = selected.yellow;
  }
  $('feedbackPill').textContent = state;
  $('feedbackPill').style.background = background;
  $('feedbackPill').style.color = color;
  $('feedbackPill').style.borderColor = `${color}55`;
  poseStage.style.background = `linear-gradient(180deg, ${background}, rgba(10, 21, 31, .82))`;
  setGlobalBackground(state);
  $('feedbackText').textContent = coachingStyle.value === 'Silent Visual Mode' ? 'Use colour, angles, and breath cues.' : phrase;
}

function saveProfile() {
  const profile = {};
  ['name', 'location', 'age', 'height', 'weight', 'language', 'goal', 'diet', 'time', 'coachingStyle'].forEach((id) => { profile[id] = $(id).value; });
  localStorage.setItem('chakrasutra-profile', JSON.stringify(profile));
  $('generatePlanBtn').textContent = 'Plan saved ✓';
  setTimeout(() => { $('generatePlanBtn').textContent = 'Generate plan'; }, 1800);
}

function loadProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem('chakrasutra-profile'));
    if (!profile) return;
    Object.entries(profile).forEach(([id, value]) => { if ($(id)) $(id).value = value; });
  } catch (error) { console.warn('Profile could not be loaded.', error); }
}

function addCameraControl() {
  const control = document.createElement('button');
  control.className = 'ghost-btn camera-btn';
  control.textContent = 'Enable camera preview';
  control.type = 'button';
  control.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      control.textContent = 'Camera unavailable — use visual mode';
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      let video = poseStage.querySelector('video');
      if (!video) {
        video = document.createElement('video');
        video.autoplay = true; video.muted = true; video.playsInline = true; video.className = 'camera-preview';
        poseStage.prepend(video);
      }
      video.srcObject = cameraStream;
      control.textContent = 'Camera connected ✓';
      control.classList.add('connected');
    } catch (error) {
      control.textContent = 'Camera denied — visual mode active';
    }
  });
  $('practicePanel').querySelector('.practice-header').appendChild(control);
}

function startOrPauseSession() {
  const starting = togglePracticeBtn.textContent === 'Start session';
  togglePracticeBtn.textContent = starting ? 'Pause session' : 'Start session';
  if (starting) {
    practiceTimer = setInterval(() => {
      elapsedSeconds += 1;
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = String(elapsedSeconds % 60).padStart(2, '0');
      const metric = document.querySelector('.metric strong');
      if (metric) metric.textContent = `${minutes}:${seconds}`;
    }, 1000);
    $('feedbackText').textContent = 'Session live. Keep breathing steadily.';
  } else {
    clearInterval(practiceTimer);
    $('feedbackText').textContent = 'Session paused. Reset when ready.';
  }
}

moodButtons.forEach((button) => button.addEventListener('click', () => {
  moodButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
  updateRecommendation();
}));

languageSelect.addEventListener('change', updateRecommendation);
coachingStyle.addEventListener('change', updateRecommendation);
kneeAngleInput.addEventListener('input', updatePoseFeedback);
togglePracticeBtn.addEventListener('click', startOrPauseSession);
$('quickStartBtn').addEventListener('click', () => $('practicePanel').scrollIntoView({ behavior: 'smooth' }));
$('generatePlanBtn').addEventListener('click', () => {
  saveProfile();
  const checked = [...document.querySelectorAll('.check-grid input:checked')];
  const level = checked.length >= 3 ? 'Yellow' : 'Green';
  setSafetyState(level);
  updateRecommendation();
  $('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

loadProfile();
setSafetyState('Green');
updateRecommendation();
addCameraControl();
window.addEventListener('beforeunload', () => cameraStream?.getTracks().forEach((track) => track.stop()));
