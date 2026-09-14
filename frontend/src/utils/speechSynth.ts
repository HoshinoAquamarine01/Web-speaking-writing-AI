export function speakText(text: string, rate: number = 1.0, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của bạn không hỗ trợ tính năng Đọc giọng nói (SpeechSynthesis).');
    return;
  }

  // Cancel any current ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.lang = 'en-US';

  // Thử tìm giọng đọc chuẩn Mỹ / Anh
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
