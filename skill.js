import chalk from 'chalk';
import wavPlayer from 'node-wav-player';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1번 특수 스킬 (화염발사)효과
export function Skillnum1(player, monster, logs) {

    // 마나가 부족할 경우
    if (player.mp < Skill1Info.mana) {
        logs.push(chalk.green(`마나가 ${Skill1Info.mana - player.mp}부족합니다.`));


        // 마나가 충분할 경우
    } else {


        // 스킬공격 소리 재생
        const skill1 = path.join(__dirname, 'sounds', 'skill1.wav');
        wavPlayer.play({ path: skill1 }).then(() => { });


        // 스킬효과
        let skillDamge = Math.floor(player.attackpower * 2 * (0.8 + Math.random() * 0.4));
        monster.hp -= skillDamge;
        player.mp -= Skill1Info.mana;
        logs.push(chalk.green(`${Skill1Info.name}를 시전해 ${chalk.red(`${skillDamge}`)}의 피해를 몬스터에게 입혔습니다.`));
        let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
        monster.hp > 0 ? player.hp -= monsterdamage : 0;
        logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
    }
}
export const Skill1Info = {
    name: '화염발사',
    mana: 30,
    Description: `강력한 화염을 발사해 적에게 피해를 입힙니다. ${chalk.red(`(마나 소모30)`)}`
}


// 2번 특수 스킬 (흡혈)효과
export function Skillnum2(player, monster, logs) {

    // 마나가 부족할 경우
    if (player.mp < Skill2Info.mana) {
        logs.push(chalk.green(`마나가 ${Skill2Info.mana - player.mp}부족합니다.`));


        // 마나가 충분할 경우
    } else {


        // 스킬공격 소리 재생
        const skill1 = path.join(__dirname, 'sounds', 'skill1.wav');
        wavPlayer.play({ path: skill1 }).then(() => { });


        // 스킬효과
        let skillDamge = Math.floor(player.attackpower * (0.8 + Math.random() * 0.4));
        let skillheal = Math.min(player.Maxhp - player.hp, Math.floor(player.attackpower * (0.8 + Math.random() * 0.4)))
        monster.hp -= skillDamge;
        player.hp += skillheal;
        player.mp -= Skill2Info.mana;
        logs.push(chalk.green(`${Skill2Info.name}을 시전해 몬스터에게 ${chalk.red(`${skillDamge}`)}의 피해를 입히고 ${chalk.red(`${skillheal}`)}의 체력을 회복합니다.`));
        let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
        monster.hp > 0 ? player.hp -= monsterdamage : 0;
        logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
    }
}
export const Skill2Info = {
    name: '흡혈',
    mana: 40,
    Description: `몬스터의 체력을 일부 빼앗아 옵니다. ${chalk.red(`(마나 소모40)`)}`
}


// 3번 특수 스킬 (마나강탈)효과
export function Skillnum3(player, monster, logs) {

    // 스킬공격 소리 재생
    const skill1 = path.join(__dirname, 'sounds', 'skill1.wav');
    wavPlayer.play({ path: skill1 }).then(() => { });


    // 스킬효과
    let skillDamge = Math.floor(player.attackpower * 0.5 * (0.8 + Math.random() * 0.4));
    let mprestore = Math.min(player.Maxmp - player.mp, Math.floor(25 * (0.8 + Math.random() * 0.4)))
    monster.hp -= skillDamge;
    player.mp += mprestore;
    logs.push(chalk.green(`${Skill3Info.name}을 시전해 몬스터에게 ${chalk.red(`${skillDamge}`)}의 피해를 입히고 마나를 ${chalk.red(`${mprestore}`)}만큼 회복하였습니다.`));
    let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
    monster.hp > 0 ? player.hp -= monsterdamage : 0;
    logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
}
export const Skill3Info = {
    name: '마나강탈',
    mana: `0`,
    Description: '마나를 얻고 몬스터에게 약간의 피해를 입힙니다.'
}

// 1번 필살기 (별의 폭발)효과
export function ultnum1(player, monster, logs) {

    // 마나가 부족할 경우
    if (player.mp < 100) {
        logs.push(chalk.green(`마나가 ${100 - player.mp}부족합니다.`));


    
        // 마나가 충분할 경우
    } else {

        // 궁극기 소리 재생
        const Ult = path.join(__dirname, 'sounds', 'Ult.wav');
        wavPlayer.play({ path: Ult }).then(() => { });


        // 스킬효과
        let skillDamge = Math.floor(player.attackpower * 6 * (0.8 + Math.random() * 0.4));
        monster.hp -= skillDamge;
        player.mp -= 100;
        logs.push(chalk.green(`${Ult1Info.name}를 시전해 ${chalk.red`${skillDamge}`}의 피해를 몬스터에게 입혔습니다.`));
        let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
        monster.hp > 0 ? player.hp -= monsterdamage : 0;
        logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
    }
}
export const Ult1Info = {
    name: '별의 폭발',
    Description: '별들이 폭발하면서 큰 피해를 줍니다. '
}


// 2번 필살기 (천상의 치유)효과
export function ultnum2(player, monster, logs) {

    // 마나가 부족할 경우
    if (player.mp < 100) {
        logs.push(chalk.green(`마나가 ${100 - player.mp}부족합니다.`));


        // 마나가 충분할 경우
    } else {


        // 힐 소리 재생
        const heal = path.join(__dirname, 'sounds', 'heal.wav');
        wavPlayer.play({ path: heal }).then(() => { });


        // 궁극기 효과
        let x = Math.floor(player.attackpower * 0.7)
        player.mp -= 100
        logs.push(chalk.green(`${Ult2Info.name}를 시전해 체력을${chalk.red(`${player.Maxhp - player.hp}`)} 회복했습니다.`));
        player.hp = player.Maxhp;
        let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
        monster.hp > 0 ? player.hp -= monsterdamage : 0;
        logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
    }
}
export const Ult2Info = {
    name: '천상의 치유',
    Description: '자신의 체력을 100% 치유합니다.'
}


// 3번 필살기 (파라오의 분노)효과
export function ultnum3(player, monster, logs) {

    // 마나가 부족할 경우
    if (player.mp < 100) {
        logs.push(chalk.green(`마나가 ${100 - player.mp}부족합니다.`));


        // 마나가 충분할 경우
    } else {


        // 궁극기 소리 재생
        const Ult = path.join(__dirname, 'sounds', 'Ult.wav');
        wavPlayer.play({ path: Ult }).then(() => { });
        let x = Math.floor(player.attackpower * 0.7)


        // 스킬효과
        logs.push(chalk.green(`${Ult3Info.name}를 시전해 5턴동안 공격력이 ${chalk.red(`${x}`)}상승합니다.`));
        player.mp -= 100
        player.Bonouspower = x;
        player.attackpower += x;
        player.Battletun = 6;
        let monsterdamage = Math.floor(monster.attackpower * (0.8 + Math.random() * 0.4));
        monster.hp > 0 ? player.hp -= monsterdamage : 0;
        logs.push(chalk.green(`몬스터로부터 ${chalk.red(`${monsterdamage}`)}의 피해를 입었습니다.`));
    }
}
export const Ult3Info = {
    name: '파라오의 분노',
    Description: '5턴 동안 자신의 공격력이 강화됩니다.'
}

console.log(Skill1Info.mana);