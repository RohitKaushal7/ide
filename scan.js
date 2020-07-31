exports.scan = code => {
  if (
    code.includes("os") ||
    code.includes("sys") ||
    code.includes("system") ||
    code.includes("fs") ||
    code.includes("open") ||
    code.includes("read") ||
    code.includes("write") ||
    code.includes("fstream") ||
    code.includes("dos") ||
    code.includes("unistd") ||
    code.includes("process") ||
    code.includes("./") ||
    code.includes("../") ||
    code.includes("fork")
  ) {
    return true;
  } else {
    return false;
  }
};

const badWords = ["app"];

exports.filter = text => {
  let str = badWords.join("|");
  let re = new RegExp(str, "i");

  return re.test(text);
};
