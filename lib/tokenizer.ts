class BPEtokenizer {
  vocab: { [key: string]: number };
  merges: Array<string>;

  constructor(vocab: { [key: string]: number }, merges: Array<string>) {
    this.vocab = vocab;
    this.merges = merges;
  }

  tokenize(text: string): Array<string> {
    let words = text.split(' ');
    let tokens = [];
    for (let word of words) {
      let chars = Array.from(word);
      let wordTokens = [];
      let i = 0;
      while (i < chars.length) {
        let token = chars[i];
        let j = i + 1;
        while (j <= chars.length) {
          let newToken = chars.slice(i, j).join('');
          if (this.vocab[newToken] !== undefined) {
            token = newToken;
          }
          j++;
        }
        wordTokens.push(token);
        i += token.length;
      }
      tokens.push(...this.applyMerges(wordTokens));
    }
    return tokens;
  }

  applyMerges(tokens: Array<string>): Array<string> {
    let newTokens = [...tokens];
    for (let merge of this.merges) {
      let [token1, token2] = merge.split(' ');
      let i = 0;
      while (i < newTokens.length - 1) {
        if (newTokens[i] === token1 && newTokens[i + 1] === token2) {
          newTokens.splice(i, 2, token1 + token2);
        } else {
          i++;
        }
      }
    }
    return newTokens;
  }
}

async function loadTokenizer(): Promise<BPEtokenizer> {
  const response = await fetch(process.env.TOKENIZER_JSON + "");
  const json = await response.json();
  const model = json.model;
  const vocab = model.vocab;
  const merges = model.merges;
  return new BPEtokenizer(vocab, merges);
}

export { loadTokenizer };