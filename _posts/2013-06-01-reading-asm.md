---
layout: post
category: 开发
tags: [汇编, 算法]
title: 从汇编分析反推加密算法
---

[之前](https://github.com/xingrz/swiftzjs/issues/1)发过的，转过来博客，顺便整理一下。

----------

## [原始汇编](http://bbs.scuec.edu.cn/read-htm-tid-1092429.html)和我的注释

```scm
MOV AL,BYTE PTR DS:[ESI+EDI]  ; FUNC(A)
MOV CL,AL                     ;   C = A
MOV DL,AL                     ;   D = A
SHR CL,1                      ;   C >> 1
AND CL,40                     ;   C = C & 01000000
AND DL,10                     ;   D = D & 00010000
OR  CL,DL                     ;   C = C | D
MOV DL,AL                     ;   D = A
SHR CL,2                      ;   C = C >> 2
AND DL,42                     ;   D = D & 01000010
MOV BL,AL                     ;   B = A
OR  CL,DL                     ;   C = C | D
MOV DL,AL                     ;   D = A
AND DL,0F9                    ;   D = D & 11111001
AND BL,20                     ;   B = B & 00100000
SHL DL,3                      ;   D = D << 3
OR  DL,BL                     ;   D = D | B
AND AL,4                      ;   A = A & 00000100
SHR CL,1                      ;   C = C >> 1
SHL DL,1                      ;   D = D << 1
OR  CL,DL                     ;   C = C | D
OR  CL,AL                     ;   C = C | A
MOV BYTE PTR DS:[ESI+EDI],CL  ; RETURN C
```

## 整理

合并等式

```js
C = ((A >> 1) & 01000000) | (A & 00010000)
C = (C >> 2) | (A & 01000010)
D = ((A & 11111001) << 3) | (A & 00100000)
C = (C >> 1) | (D << 1) | (A & 00000100)
```

将最外层的 `|` 运算拆分步骤

```js
C = ((A >> 1) & 01000000)
C = C | (A & 00010000)
C = (C >> 2) | (A & 01000010)
C = (C >> 1) | ((A & 11111001) << 4)
C = C | (A & 00100000) << 1
C = C | (A & 00000100)
```

移动移位运算符

```js
C = (A >> 4) & 00001000
C = C | (A & 00010000) >> 3
C = C | (A & 01000010) >> 1
C = C | (A & 11111001) << 4
C = C | (A & 00100000) << 1
C = C | (A & 00000100)
```

解开第一行的 `A >> 4`、解开 `&` 运算

```js
= (A & 10000000) >> 4
| (A & 01000000) >> 1
| (A & 00100000) << 1
| (A & 00010000) >> 3
| (A & 00001000) << 4
| (A & 00000100)
| (A & 00000010) >> 1
| (A & 00000001) << 4
```

假如给一个字节的 8 个位按顺序编号 `ABCDEFGH` 的话，由此不难理解，此算法的本质是将 `ABCDEFGH` 重排为 `ECBHAFDG`。

## 最终代码

```js
function encrypt (buffer) {
  var result = new Buffer(buffer.length)

  for (var i = 0; i < buffer.length; i++) {
    result[i] = (buffer[i] & 0x80) >> 4
              | (buffer[i] & 0x40) >> 1
              | (buffer[i] & 0x20) << 1
              | (buffer[i] & 0x10) >> 3
              | (buffer[i] & 0x08) << 4
              | (buffer[i] & 0x04) // 0  <- 明显这是强迫症
              | (buffer[i] & 0x02) >> 1
              | (buffer[i] & 0x01) << 4
  }

  return result
}
```
