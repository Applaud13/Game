import chalk, { foregroundColorNames } from 'chalk';
import readlineSync from 'readline-sync';
import { Player } from './player.js';
import { Shop, Purchase } from './shop.js';
import {
  Skillnum1,
  Skillnum2,
  Skillnum3,
  Skill1Info,
  Skill2Info,
  Skill3Info,
  ultnum1,
  ultnum2,
  ultnum3,
  Ult1Info,
  Ult2Info,
  Ult3Info
} from './skill.js';
import fs from 'fs';
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';

// 소리파일 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 몬스터 함수
class Monster {
  constructor(x) {
    this.Maxhp = 50 + 6 * x * (x + 1);
    this.hp = 50 + 6 * x * (x + 1);
    this.attackpower = 7 + x * (x + 1);
  }
}


// 기본 상태창
function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 체력:${player.Maxhp}/${chalk.red(`${player.hp}`)} 마나:${player.Maxmp}/${chalk.red(`${player.mp}`)} 공격력:${chalk.red(`${player.attackpower}`)} 보유골드:${chalk.yellow(`${player.gold}`)}원 `,
    ) +
    chalk.greenBright(
      `| 몬스터 상태 체력:${chalk.red(`${monster.hp}`)} 공격력:${chalk.red(`${monster.attackpower}`)} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================`));


  // 몬스터 HPbar (체력 상태에 따라 빨강, 주황, 초록)
  let HPbar = ``;
  let HPdamged = ``;
  let playerMPbar = ``;
  let playerMP = ``;
  let Manabar;
  let MonsterHPbar = ``;
  let MonsterHPdamaged = ``;
  let monsterhpbar;
  for (let i = 0; i < 20; i++) {
    MonsterHPbar += ` `;
    if ((20 * monster.hp) / monster.Maxhp <= 1 + i && i < 6) {
      for (let x = 0; x < 19 - i; x++) {
        MonsterHPdamaged += ` `;
      }
      monsterhpbar = `몬스터 : ${chalk.bgRed(MonsterHPbar)}${chalk.bgHex('#a9a9a9')(MonsterHPdamaged)}`;
      break;
    } else if ((20 * monster.hp) / monster.Maxhp <= 1 + i && i < 12) {
      for (let x = 0; x < 19 - i; x++) {
        MonsterHPdamaged += ` `;
      }
      monsterhpbar = `몬스터 : ${chalk.bgHex('#FFA500')(MonsterHPbar)}${chalk.bgHex('#a9a9a9')(MonsterHPdamaged)}`;
      break;
    } else if ((20 * monster.hp) / monster.Maxhp <= 1 + i) {
      for (let x = 0; x < 19 - i; x++) {
        MonsterHPdamaged += ` `;
      }
      monsterhpbar = `몬스터 : ${chalk.bgGreen(MonsterHPbar)}${chalk.bgHex('#a9a9a9')(MonsterHPdamaged)}`;
      break;
    }
  }


  // 플레이어 Manabar (파란색)
  for (let i = 0; i < 21; i++) {
    if ((20 * player.mp) / player.Maxmp <= i) {
      for (let x = 0; x < 19 - i; x++) {
        playerMPbar += ` `;
      }
      Manabar = `플레이어 마나 : ${chalk.bgBlue(playerMP)}${chalk.bgHex('#a9a9a9')(playerMPbar)}`;
      break;
    }
    playerMP += ` `;
  }


  // 플레이어 HPbar
  for (let i = 0; i < 20; i++) {
    HPbar += ` `;
    if ((20 * player.hp) / player.Maxhp <= 1 + i && i < 6) {
      for (let x = 0; x < 19 - i; x++) {
        HPdamged += ` `;
      }
      console.log(`플레이어 체력: ${chalk.bgRed(HPbar)}${chalk.bgHex('#a9a9a9')(HPdamged)}     ${Manabar}     ${monsterhpbar}`);
      break;
    } else if ((20 * player.hp) / player.Maxhp <= 1 + i && i < 12) {
      for (let x = 0; x < 19 - i; x++) {
        HPdamged += ` `;
      }
      console.log(`플레이어 체력: ${chalk.bgHex('#FFA500')(HPbar)}${chalk.bgHex('#a9a9a9')(HPdamged)}     ${Manabar}     ${monsterhpbar}`);
      break;
    } else if ((20 * player.hp) / player.Maxhp <= 1 + i) {
      for (let x = 0; x < 19 - i; x++) {
        HPdamged += ` `;
      }
      console.log(`플레이어 체력: ${chalk.bgGreen(HPbar)}${chalk.bgHex('#a9a9a9')(HPdamged)}     ${Manabar}     ${monsterhpbar}`);
      break;
    }
  }
}


// 전투 진행
const battle = async (stage, player, monster) => {

  let logs = [];


  // 몬스터나 플레이어가 죽을때까지 실행
  while (player.hp > 0) {

    // 로그는 12개까지만 표시
    console.clear();
    displayStatus(stage, player, monster);
    if (logs.length > 12) {
      logs.shift();
      logs.shift();
    }
    logs.forEach((log) => console.log(log));
    console.log(
      chalk.green(
        `\n 1.기본 공격  ${chalk.hex(`#FFA500`)(`2.${player.skillinfo.name}${player.skillinfo.mana}`)}. ${chalk.red(`3.${player.Ultname}(100)`)} 4.포획(${Math.max(0, 20 - Math.floor(stage * 0.5))}%).`,
      ),
    );


    // 몬스터 사망 시 골드 획득 및 배틀 종료
    if (monster.hp <= 0) {
      await Winbattle();
      break;
    }
    async function Winbattle() {

      // 골드 증가
      player.gold += 60 + (1 + stage) * stage * 2;
      console.clear();


      // 승리 소리 재생
      const victory = path.join(__dirname, 'sounds', 'victory.wav');
      wavPlayer.play({ path: victory }).then(() => { });


      // 상점으로 이동
      console.log(`${chalk.bgGreen(`                   `)}`)
      console.log(`${chalk.bgBlue(`${stage} 스태이지 클리어!!`)}`)
      console.log(`${chalk.bgGreen(`                   `)}`)
      let space = ``;
      for (let i = 0; i < 50; i++) {
        const Move = `${chalk.green((` 상점으로 이동중입니다${space}🏄‍♂️`))}`
        process.stdout.clearLine(0);
        process.stdout.write(Move);
        process.stdout.cursorTo(0);
        space += ` `;
        await new Promise(resolve => setTimeout(resolve, 70));
      }
    }



    // 플레이어의 선택에 따라 진행
    const choice = readlineSync.question('당신의 선택은? ');
    console.log(`전투를 수행중입니다.....`)
    await new Promise(resolve => setTimeout(resolve, 500));
    console.clear();
    UserChoiceInput();
    function UserChoiceInput() {
      switch (choice) {

        // 1 일반 공격 : 공격력의 70~150% 피해 및 5~15마나 회복
        case '1':

          // 기본공격 소리
          const basichit = path.join(__dirname, 'sounds', 'basichit.wav');
          wavPlayer.play({ path: basichit }).then(() => { });


          //기본공격 효과
          let damage = Math.floor(player.attackpower * (0.7 + Math.random() * 0.8));
          monster.hp -= damage;
          let manarestroe = Math.min(player.Maxmp - player.mp, Math.floor(10 * (0.5 + Math.random())))
          player.mp += manarestroe
          logs.push(chalk.green(`일반 공격을 가해 ${chalk.red(`${damage}`)}의 피해를 입히고 ${chalk.red(`${manarestroe}`)}의 마나를 회복했습니다.`));
          let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
          monster.hp > 0 ? player.hp -= monsterdamage : 0;
          logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));



          break;


        // 2 스킬 선택 시
        case '2':
          player.skill(player, monster, logs);
          break;


        // 3 궁극기 선택 시
        case '3':
          player.Ultimate(player, monster, logs);
          break;


        // 4 포획 선택 시
        case '4':
          if (Math.random() * 100 < Math.max(0, 20 - Math.floor(stage * 0.5))) {
            logs.push(chalk.green(`포획에 성공하였습니다!!`));
            monster.hp = 0;
          } else {
            let monsterdamage4 = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
            player.hp -= monsterdamage4;


            // 실패 소리
            const fail = path.join(__dirname, 'sounds', 'fail.wav');
            wavPlayer.play({ path: fail }).then(() => { });
            logs.push(chalk.green(
              `포획에 실패하였습니다.
몬스터로부터 ${monsterdamage4}의 피해를 입었습니다.`));
          }
          break;


        // 잘못된 선택 시
        default:
          logs.push(chalk.green(`올바른 선택을 하세요`));
          break;
      }
    }


    // 지속효과 카운팅 (파라오의 분노)
    player.Battletun--;
    if (player.Battletun === 0) {
      player.attackpower -= player.Bonouspower;
    }
  }
}


// 게임 시작
export async function startGame() {


  // 기본 데이터 생성
  console.clear();
  const player = new Player();
  const shop = new Shop();
  let stage = 1;


  // 스킬 선택 및 장착
  Skillchoice();
  function Skillchoice() {
    const skillchoice = readlineSync.question(
      chalk.green(`스킬을 선택해주세요`) + chalk.blue(`
      1.${Skill1Info.name}`) + ` : ${Skill1Info.Description}` + chalk.blue(`
      2.${Skill2Info.name}`) + ` : ${Skill2Info.Description}` + chalk.blue(`
      3.${Skill3Info.name}`) + ` : ${Skill3Info.Description}`);
    switch (skillchoice) {
      case '1':
        player.skill = Skillnum1;
        player.skillinfo = Skill1Info;
        console.log(chalk.red(`${Skill1Info.name}를 장착하셨습니다!`))
        break;
      case '2':
        player.skill = Skillnum2;
        player.skillinfo = Skill2Info;
        console.log(chalk.red(`${Skill2Info.name}를 장착하셨습니다!`))
        break;
      case '3':
        player.skill = Skillnum3;
        player.skillinfo = Skill3Info;
        console.log(chalk.red(`${Skill3Info.name}를 장착하셨습니다!`))
        break;

      default:
        console.clear();
        console.log(chalk.green(`올바른 선택을 하세요`));
        Skillchoice();
        break;
    }
  }

  // 궁극기 선택 및 장착
  Ultchoice();
  function Ultchoice() {
    const ultchoice = readlineSync.question(
      chalk.green(`
궁극기를 선택해주세요 ${chalk.red(`마나소모 100`)}`) + chalk.blue(`
        1.${Ult1Info.name}`) + ` : ${Ult1Info.Description}` + chalk.blue(`
        2.${Ult2Info.name}`) + ` : ${Ult2Info.Description}` + chalk.blue(`
        3.${Ult3Info.name}`) + ` : ${Ult3Info.Description}`);
    switch (ultchoice) {
      case '1':
        player.Ultimate = ultnum1;
        player.Ultname = Ult1Info.name;
        break;
      case '2':
        player.Ultimate = ultnum2;
        player.Ultname = Ult2Info.name;
        break;
      case '3':
        player.Ultimate = ultnum3;
        player.Ultname = Ult3Info.name;
        break;

      default:
        console.clear();
        console.log(chalk.green(`올바른 선택을 하세요`));
        Ultchoice();
        break;
    }
  }
  console.log(chalk.red(`${player.Ultname}장착이 완료되었습니다.`));
  let Ready = ``;
  process.stdout.write(Ready);


  // 준비 완료
  for (let i = 0; i < 5; i++) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    Ready = `${chalk.yellow(`이제 곧 전투가 진행됩니다! ${5 - i}`)}`
    process.stdout.write(Ready);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }


  // 체력 남아있을 경우: 몬스터 생성 → 배틀 → 상점 반복
  async function Fight() {
    while (player.hp > 0) {
      const monster = new Monster(stage);
      await battle(stage, player, monster);
      monster.hp < 0 ? await Purchase(stage, player, monster, shop) : end(stage);
      stage++;
    }
  }
  Fight();
}


// 게임 종료
function end(stage) {

  // 게임 종료 소리 재생
  const gameover = path.join(__dirname, 'sounds', 'gameover.wav');
  wavPlayer.play({ path: gameover }).then(() => { });


  // 등수 저장될 파일 위치
  const filePath = 'data.json';


  // 순위 저장 및 불러오기 함수
  const savedata = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
  const loaddata = () => {
    const Basicdata = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(Basicdata);
  }


  // index0에 현재 stage 저장 및 순위 재정렬 (1~5번은 5~1등)
  const Rank = loaddata();
  Rank[0] = stage;
  Rank.sort((a, b) => a - b);
  savedata(Rank);


  // 순위권에 들어갈 경우 / 안들어갈 경우 최종 메시지 노출
  console.clear();
  if (stage >= Rank[1]) {
    console.log(`${chalk.red(`${stage}스태이지까지 까지 오시나디.. 대단합니다! 당신의 등수가 순위표에 올라갔습니다!`)}`)
  } else {
    console.log(`${chalk.red(`${stage}스태이지까지 까지 오셨군요.. 아쉽습니다! 다음에는 순위권에 도전해보세요!`)}`)
  }
  console.log(chalk.green(`        순위표`));
  Rank[5] === stage ? console.log(chalk.red(`    현재 1등 : ${Rank[5]}층`)) : console.log(chalk.green(`    현재 1등 : ${Rank[5]}층`));
  Rank[4] === stage ? console.log(chalk.red(`    현재 2등 : ${Rank[4]}층`)) : console.log(chalk.green(`    현재 2등 : ${Rank[4]}층`));
  Rank[3] === stage ? console.log(chalk.red(`    현재 3등 : ${Rank[3]}층`)) : console.log(chalk.green(`    현재 3등 : ${Rank[3]}층`));
  Rank[2] === stage ? console.log(chalk.red(`    현재 4등 : ${Rank[2]}층`)) : console.log(chalk.green(`    현재 4등 : ${Rank[2]}층`));
  Rank[1] === stage ? console.log(chalk.red(`    현재 5등 : ${Rank[1]}층`)) : console.log(chalk.green(`    현재 5등 : ${Rank[1]}층`));

}
