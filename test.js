import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 소리 파일 경로 설정
const victory = path.join(__dirname, 'sounds', 'victory.wav');

// 소리 재생
wavPlayer.play({
    path: victory
}).then(() => {
    console.log('Sound played successfully');
}).catch((error) => {
    console.error('Error playing sound:', error);
});
