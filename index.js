import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from "./game.js";
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 현재 파일의 디렉토리 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('무한의 탑', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.bgRedBright(' '.repeat(50));
    for (let i = 0; i < 51; i += 5) {
        console.log(chalk.bgRedBright(' '.repeat(i)));
    }

    // 게임 이름
    console.log(chalk.yellowBright.bold('무한의 탑에 오신것을 환영합니다!'));
    console.log();

    // 옵션들
    console.log(chalk.green('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.green('2.') + chalk.white(' 명예의 전당 둘러보기'));
    console.log(chalk.green('9.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}


// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            startGame();
            break;
        case '2':
            HOF();
            console.clear();
            displayLobby()
            handleUserInput();
            break;
        case '9':
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}


// 게임 시작 함수
function start() {
    // 소리 재생
    const Start = path.join(__dirname, 'sounds', 'Start.wav');
    wavPlayer.play({ path: Start }).then(() => { });
    displayLobby();
    handleUserInput();
}


// 명예의 전당 함수
function HOF() {
    console.clear();

    // 입장 소리 재생
    const hof = path.join(__dirname, 'sounds', 'hof.wav');
    wavPlayer.play({ path: hof }).then(() => { });

    // 타이틀 텍스트??
    console.log(
        chalk.cyan(
            figlet.textSync('명예의 전당', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );


    // UI
    const line = chalk.bgBlueBright(' '.repeat(50));
    console.log(line);
    console.log(line);
    console.log(line);
    console.log(chalk.yellowBright.bold('        명예의 전당에 오신걸 환영합니다!'));
    console.log();


    // 순위 나열
    const filePath = 'data.json';
    const loaddata = () => {
        const Basicdata = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(Basicdata);
    }
    const Rank = loaddata();
    console.log(chalk.green('현재1위: ') + chalk.white(` ${Rank[5]}스태이지`));
    console.log(chalk.green('현재2위: ') + chalk.white(` ${Rank[4]}스태이지`));
    console.log(chalk.green('현재3위: ') + chalk.white(` ${Rank[3]}스태이지`));
    console.log(chalk.green('현재4위: ') + chalk.white(` ${Rank[2]}스태이지`));
    console.log(chalk.green('현재5위: ') + chalk.white(` ${Rank[1]}스태이지 \n`));


    // 하단 경계선
    console.log(line);
    console.log(line);
    console.log(line);


    // 하단 설명
    console.log(chalk.gray('뒤로가실려면 9번을 눌러주세요.'));
    function HOFout() {
        const choice = readlineSync.question('입력: ');
        switch (choice) {
            case '9':
                break;
            default:
                console.log(chalk.red('올바른 선택을 하세요.'));
                HOFout(); // 유효하지 않은 입력일 경우 다시 입력 받음
        }
    }

    HOFout();
}


// 게임 실행 및 종료
start();
