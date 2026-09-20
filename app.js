const moodMap = {
  Sad: {
    routine: 'Gentle stretching, breathwork, and deep relaxation',
    guidance: 'Soft flute and calm support for a steady, easing session.',
    language: { en: 'You are safe to move gently today.', ta: 'இன்று மெதுவாக நகர்ந்து சுவாசம் கவனிக்கலாம்.', hi: 'आज धीरे-धीरे बढ़ें और शांति से सांस लें।', te: 'ఈ రోజు నెమ్మదిగా కదలండి, శ్వాసను సునిశితంగా తీసుకోండి.' },
    bg: '#d9caa7'
  },
  Worried: {
    routine: 'Grounding poses and slow breath cues',
    guidance: 'This flow is calming, steady, and reassuring.',
    language: { en: 'Let your breath settle and root down.', ta: 'சுவாசத்தை அமைதியாக்கி, நிலைத்து நிற்கவும்.', hi: 'श्वास को स्थिर करें, जड़ता महसूस करें।', te: 'శ్వాసను స్థిరంగా తీసుకుని, నిదానంగా నిలపడండి.' },
    bg: '#c8d6dd'
  },
  Stressed: {
    routine: 'Neck and upper-back release with a short flow',
    guidance: 'Keep the session short and quiet.',
    language: { en: 'Take a soft reset. Your body is supported.', ta: 'மென்மையாக மீட்குங்கள். உங்கள் உடல் பாதுகாக்கப்படுகிறது.', hi: 'सॉफ्ट रीसेट लें, आपका शरीर सुरक्षित है।', te: 'మృదువుగా పునరావాసం తీసుకోండి. మీ శరీరం రక్షించబడింది.' },
    bg: '#d7d7f3'
  },
  Irritated: {
    routine: 'Controlled movement and grounding flow',
    guidance: 'Focus on one breath and one movement at a time.',
    language: { en: 'Stay steady and gentle with your breath.', ta: 'சுவாசத்துடன் அமைதியாக இருங்கள்.', hi: 'साँस के साथ शांति से आगे बढ़ें।', te: 'శ్వాసతో నెమ్మదిగా, స్థిరంగా కదలండి.' },
    bg: '#f0d7a0'
  },
  Normal: {
    routine: 'Balanced beginner flow with steady mobility',
    guidance: 'A balanced practice keeps your rhythm strong and calm.',
    language: { en: 'You are in a good rhythm. Hold the breath and align.', ta: 'நல்ல ஓட்டத்தில் இருக்கிறீர்கள். சுவாசத்தைநிறுத்தி சீரமைக்கவும்.', hi: 'आप सही लय में हैं। श्वास को स्थिर करें और संरेखित करें।', te: 'మీరు మంచి రిథమ్లో ఉన్నారు. శ్వాసను స్థిరంగా తీసుకుని సరిపోయేలా కదలండి.' },
    bg: '#ccefd9'
  },
  Energetic: {
    routine: 'Sunrise flow and dynamic activation',
    guidance: 'A brighter rhythm with mindful energy and power.',
    language: { en: 'Move with energy, stay alert, and breathe deeply.', ta: 'ஆற்றலுடன் நகர்ந்து, ஆழமாக சுவாசம் எடுத்துக் கொள்ளுங்கள்.', hi: 'ऊर्जा के साथ चलें और गहराई से साँस लें।', te: 'శక్తితో కదలండి, గాఢంగా శ్వాస తీసుకోండి.' },
    bg: '#d9f0cb'
  },
  Tired: {
    routine: 'Light mobility and restorative breathing',
    guidance: 'Keep the practice short and restorative.',
    language: { en: 'Rest is part of progress. Move gently.', ta: 'विश्रामவும் முன்னேற்றம். மெதுவாக நகருங்கள்.', hi: 'आराम भी प्रगति है। धीरे-धीरे चलें।', te: 'సమాధానం కూడా ఎదుగుదల. నెమ్మదిగా కదలండి.' },
    bg: '#d0d0e6'
  }
};

const safetyMap = {
  Green: {
    title: 'Beginner Safe Flow',
    list: ['5-minute breathing + shoulder mobility', 'Gentle standing poses', 'Focus on kneecap alignment and posture']
  },
  Yellow: {
    title: 'Modified Mobility Flow',
    list: ['Shorter practice with more guided pauses', 'Avoid deep knee bends and long holds', 'Use chair-friendly variations where needed']
  },
  Orange: {
    title: 'Gentle Recovery Plan',
    list: ['Breathing with low-intensity movement', 'No deep flexion or twisting', 'Professional clearance recommended']
  },
  Red: {
    title: 'Medical Review Required',
    list: ['Pause exercise and consult care professional', 'No active yoga practice until clearance', 'Prioritize rest, hydration, and comfort']
  }
};

const moodButtons = document.querySelectorAll('.mood-btn');
const recommendationBox = document.getElementById('recommendationBox');
const planTitle = document.getElementById('planTitle');
const planList = document.getElementById('planList');
const safetyPill = document.getElementById('safetyPill');
const weatherCard = document.getElementById('weatherCard');
const hydrationTip = document.getElementById('hydrationTip');
const mealTip = document.getElementById('mealTip');
const kneeAngleInput = document.getElementById('kneeAngle');
const angleValue = document.getElementById('angleValue');
const feedbackPill = document.getElementById('feedbackPill');
const feedbackText = document.getElementById('feedbackText');
const poseStage = document.getElementById('poseStage');
const togglePracticeBtn = document.getElementById('togglePracticeBtn');
const quickStartBtn = document.getElementById('quickStartBtn');

const languagePhrases = {
  Tamil: {
    red: 'டேய் தம்பி, தப்பு பண்றடா.',
    yellow: 'பத்தாது, பத்தாது.',
    green: 'சூப்பர் யானி.'
  },
  Hindi: {
    red: 'अरे भाई, गलत हो रहा है.',
    yellow: 'बस, बस… थोड़ा और.',
    green: 'बिल्कुल सही, मज़ा आ गया.'
  },
  English: {
    red: 'A bit off — adjust the knee more.',
    yellow: 'Almost there — just a small tweak.',
    green: 'Perfect. Hold the pose and breathe.'
  },
  Telugu: {
    red: 'అబ్బో, తప్పు దిశలో వుంది.',
    yellow: 'చాలా తక్కువే… ఇంకొంచెం.',
    green: 'చాలా బాగుంది, అలాగే ఉంచండి.'
  }
};

const languageSelect = document.getElementById('language');
const coachingStyle = document.getElementById('coachingStyle');

function setSafetyState(level) {
  const meta = safetyMap[level];
  safetyPill.textContent = level;
  planTitle.textContent = meta.title;
  planList.innerHTML = meta.list.map((item) => `<li>${item}</li>`).join('');
  const tone = {
    Green: 'rgba(118, 255, 182, 0.12)',
    Yellow: 'rgba(255, 204, 102, 0.12)',
    Orange: 'rgba(255, 160, 87, 0.12)',
    Red: 'rgba(255, 126, 126, 0.12)'
  };
  safetyPill.style.background = tone[level];
  safetyPill.style.color = level === 'Green' ? '#75f2b0' : level === 'Yellow' ? '#fced9a' : level === 'Orange' ? '#f7b76e' : '#f58e8b';
}

function updateRecommendation() {
  const mood = document.querySelector('.mood-btn.active')?.dataset.mood || 'Normal';
  const data = moodMap[mood];
  recommendationBox.innerHTML = `<strong>Recommended flow:</strong><p>${data.routine}. ${data.guidance}</p>`;

  const weatherText = weatherCard.textContent;
  if (weatherText.includes('Hot') || weatherText.includes('humid')) {
    hydrationTip.textContent = 'Today is hot and humid. Keep water nearby before practice.';
    mealTip.textContent = 'Breakfast: idli + sambar + fruit. Midday: tender coconut water.';
  } else if (weatherText.includes('Rain')) {
    hydrationTip.textContent = 'A rainy day calls for indoor movement and steady hydration.';
    mealTip.textContent = 'Warm soup, idli, and cooked vegetables fit well for the weather.';
  } else {
    hydrationTip.textContent = 'A gentle sip before and after practice will help you stay fresh.';
    mealTip.textContent = 'Balanced meal with dal, vegetables, and fruit suits your wellness goal.';
  }

  if (coachingStyle.value === 'Silent Visual Mode') {
    feedbackText.textContent = 'Use colour, angles, and breath cues.';
  } else {
    const selectedLanguage = languageSelect.value;
    const phrases = languagePhrases[selectedLanguage] || languagePhrases.Tamil;
    if (Number(kneeAngleInput.value) < 60) {
      feedbackText.textContent = phrases.red;
    } else if (Number(kneeAngleInput.value) < 80) {
      feedbackText.textContent = phrases.yellow;
    } else {
      feedbackText.textContent = phrases.green;
    }
  }
}

function updatePoseFeedback() {
  const angle = Number(kneeAngleInput.value);
  angleValue.textContent = `${angle}°`;

  let state = 'Red';
  let background = 'rgba(255, 146, 146, 0.22)';
  let textColor = '#f58e8b';
  let phrase = languagePhrases[languageSelect.value]?.red || languagePhrases.Tamil.red;

  if (angle >= 80) {
    state = 'Green';
    background = 'rgba(118, 255, 182, 0.22)';
    textColor = '#75f2b0';
    phrase = languagePhrases[languageSelect.value]?.green || languagePhrases.Tamil.green;
  } else if (angle >= 60) {
    state = 'Yellow';
    background = 'rgba(255, 228, 142, 0.2)';
    textColor = '#fced9a';
    phrase = languagePhrases[languageSelect.value]?.yellow || languagePhrases.Tamil.yellow;
  }

  feedbackPill.textContent = state;
  feedbackPill.style.background = background;
  feedbackPill.style.color = textColor;
  feedbackPill.style.borderColor = `${textColor}55`;

  poseStage.style.background = `linear-gradient(180deg, ${background}, rgba(10, 21, 31, 0.82))`;

  if (coachingStyle.value !== 'Silent Visual Mode') {
    feedbackText.textContent = phrase;
  }
}

moodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    moodButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateRecommendation();
  });
});

languageSelect.addEventListener('change', updateRecommendation);
coachingStyle.addEventListener('change', updateRecommendation);

kneeAngleInput.addEventListener('input', () => {
  updatePoseFeedback();
  updateRecommendation();
});

quickStartBtn.addEventListener('click', () => {
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

togglePracticeBtn.addEventListener('click', () => {
  const active = togglePracticeBtn.textContent === 'Start session';
  togglePracticeBtn.textContent = active ? 'Pause session' : 'Start session';
  feedbackText.textContent = active ? 'Session live. Keep breathing steadily.' : 'Session paused. Reset when ready.';
});

document.getElementById('generatePlanBtn').addEventListener('click', () => {
  const selectedMood = document.querySelector('.mood-btn.active')?.dataset.mood || 'Normal';
  const safetyLevel = selectedMood === 'Stressed' || selectedMood === 'Sad' ? 'Green' : 'Yellow';
  setSafetyState(safetyLevel);
  updateRecommendation();
  updatePoseFeedback();
});

setSafetyState('Green');
updateRecommendation();
updatePoseFeedback();
weatherCard.textContent = 'Hot & humid';
