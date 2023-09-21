import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private readonly playedTexts = new Set<string>();
  private readonly textPlayTimes = new Map<string, number>();

  private cleanupInterval: number | undefined;

  constructor() {
    this.cleanupInterval = window.setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [text, time] of this.textPlayTimes) {
      if (now - time > 5 * 60 * 1000) {
        this.textPlayTimes.delete(text);
        this.playedTexts.delete(text);
      }
    }
  }

  //通过按钮触发此方法，不会限制播放。如果是后台的api触发此方法，则短时间内无法播放相同的文本。
  speak(text: string, volume?: number, rate?: number, pitch?: number, playTimes?: number) {
    // text = text.split("").join(" ");//防止手机号被当作整数念出来。不能全局替换，因为需要把排号当成整数念出。
    console.log("this.isAllowTts()", this.isAllowTts())
    if (this.isAllowTts()) {
      const message = new SpeechSynthesisUtterance();
      let number = playTimes ? playTimes : 2;
// 根据number把text多次拼接成一个。
      // 根据 number 将 text 拼接多次
      let concatenatedText = "";
      for (let i = 0; i < number; i++) {
        concatenatedText += text + ". ";
      }
      console.log(concatenatedText)
        // 初次播放，也添加一个随机生成的字符
      message.text = this.playedTexts.has(concatenatedText) ? concatenatedText + " " : concatenatedText;
      message.lang = 'en-US'; // 设置语言，默认为浏览器的语言
      message.volume = volume ? volume : 1; // 音量（0到1之间的值）
      message.rate = rate ? rate : 1; // 语速（0.1到10之间的值）
      message.pitch = pitch ? pitch : 1; // 音调（0到2之间的值）

      speechSynthesis.speak(message);

      // 把当前文本添加到已播放集合
      this.playedTexts.add(concatenatedText);
      // 记录当前文本的播放时间
      this.textPlayTimes.set(concatenatedText, Date.now());
    }
  }


  // //通过按钮触发此方法，不会限制播放。如果是后台的api触发此方法，则短时间内无法播放相同的文本。
  // speak(text: string, volume?: number, rate?: number, pitch?: number, playTimes?: number) {
  //   // text = text.split("").join(" ");//防止手机号被当作整数念出来。不能全局替换，因为需要把排号当成整数念出。
  //   console.log("this.isAllowTts()", this.isAllowTts())
  //   if (this.isAllowTts()) {
  //     const message = new SpeechSynthesisUtterance();
  //     let number = playTimes ? playTimes : 2;
  //     let count = 0;
  //
  //     message.onend = () => {
  //       count++;
  //       if (count < number) {
  //         // 上次播放结束，进行下一次播放
  //         // 在每次播放之前，都添加一个随机生成的字符
  //         message.text = this.playedTexts.has(text) ? text + " " : text;
  //         console.log(message.text)
  //         speechSynthesis.speak(message);
  //       } else {
  //         // 所有播放次数已完成
  //         console.log('播放完成');
  //       }
  //     };
  //
  //     message.onerror = (event) => {
  //       // 播放错误
  //       console.error('播放错误:', event.error);
  //     };
  //
  //     // 初次播放，也添加一个随机生成的字符
  //     message.text = this.playedTexts.has(text) ? text + " " : text;
  //     message.lang = 'zh-CN'; // 设置语言，默认为浏览器的语言
  //     message.volume = volume ? volume : 1; // 音量（0到1之间的值）
  //     message.rate = rate ? rate : 1; // 语速（0.1到10之间的值）
  //     message.pitch = pitch ? pitch : 1; // 音调（0到2之间的值）
  //
  //     speechSynthesis.speak(message);
  //
  //     // 把当前文本添加到已播放集合
  //     this.playedTexts.add(text);
  //     // 记录当前文本的播放时间
  //     this.textPlayTimes.set(text, Date.now());
  //   }
  // }

  destroy() {
    if (this.cleanupInterval) {
      window.clearInterval(this.cleanupInterval);
    }
  }

  isAllowTts() {
    return 'speechSynthesis' in window;
  }
}
