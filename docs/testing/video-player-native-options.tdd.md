# VideoPlayer のネイティブオプション追加の TDD 記録

**対象**: `VideoPlayer` に `playsinline` / `loop` / `cover` / `background` / `autopause` / `preload` と
`play` / `pause` / `ended` / `error` の emits を追加する
**ブランチ**: `worktree-video-player-native-options`（基点 `45419db` = v4.21.1）
**計画の出所**: 会話上で合意した実装計画（`*.plan.md` は作成していない）

## 背景

tokyo-anime-mart が `VimeoPlayer` から `VideoPlayer` へ乗り換えるにあたり、
ネイティブの video 要素側に不足していたオプションを揃えるための変更。

## ユーザージャーニー

1. iOS の閲覧者として、動画が全画面へ飛ばずその場で再生されてほしい（`playsinline`）
2. 閲覧者として、カードの背景で動画がループし続けてほしい（`loop` / `cover` / `background`）
3. 閲覧者として、別の動画を再生したら前の動画が止まってほしい（`autopause`）
4. 実装者として、動画の再生終了を受け取って次の動画へ送りたい（`@ended`）
5. 実装者として、既存の `VideoPlayer` の見た目や挙動を壊されたくない（後方互換）

## タスクごとの記録

### タスク 1: autopause の登録簿（TDD）

`src/runtime/composables/elements/video-autopause.ts` を
`test/video-autopause.test.ts` で駆動した。

| 段階 | コマンド | 結果 |
| --- | --- | --- |
| RED | `npx vitest run test/video-autopause.test.ts` | `Error: Cannot find module '../src/runtime/composables/elements/video-autopause'` / 1 failed, no tests |
| GREEN | 同上 | `Test Files 1 passed (1)` / `Tests 8 passed (8)` |
| lint | `npx eslint src/runtime/composables/elements/video-autopause.ts test/video-autopause.test.ts` | 終了コード 0 |

RED は未実装によるコンパイル時の失敗であり、無関係な構文エラーやテスト基盤の
不備によるものではない。

この composable は他と違い `#imports` へ依存しない。DOM も Nuxt も要らない
純ロジックに保つことで、Nuxt を起動せず単体で検証できるようにした。

コミット: `096cbfc`（RED）→ `b319fde`（GREEN）

### タスク 2: VideoPlayer への props / emits 追加

ユニットテストは書いていない。このリポジトリにコンポーネントの
ユニットテストの前例が無く（`test/` にあるのは Nuxt fixture の SSR スモーク
1 本のみ）、テスト基盤の新規導入は今回の変更に見合わないと判断した。
代わりにロジックをタスク 1 の composable へ寄せ、コンポーネント側は
宣言的な受け渡しに留めたうえで lint と型チェックで担保している。

| 確認内容 | コマンド | 結果 |
| --- | --- | --- |
| lint（リポジトリ全体） | `npx eslint .` | 出力なし |
| 型チェック（本体） | `npx vue-tsc --noEmit` | 変更ファイルのエラー 0 件 |
| 型チェック（playground） | `cd playground && npx vue-tsc --noEmit` | `video-player` のエラーなし |
| テスト（全体） | `npx vitest run` | `Test Files 2 passed (2)` / `Tests 9 passed (9)` |

型チェックには 15 件のエラーが残るが、すべて今回触っていないファイルのもの。

| ファイル | 件数 |
| --- | --- |
| `src/runtime/components/elements/VimeoPlayer.vue` | 1 |
| `src/runtime/components/navigation/TreeMenu.vue` | 10 |
| `src/runtime/composables/text-segmenter.ts` | 4 |

実装中に 1 件だけ自分の変更起因のエラーを出した。`:playsinline="playsinline || null"`
が `Booleanish | undefined` に合わないというもので、`undefined` に直して解消した
（Vue は `null` / `undefined` のどちらでも属性を削除する）。

コミット: `94d86aa`

### タスク 3: プレイグラウンドへの確認例追加

`loop` / `playsinline` の切り替え、`@ended` の受信回数表示、`cover` / `background`
を高さ 240 の箱に入れた例、`autopause` を 2 台並べた例を追加した。

コミット: `31830ba`

## テスト仕様

| # | 保証される内容 | テスト | 種別 | 結果 |
| --- | --- | --- | --- | --- |
| 1 | 登録したプレイヤーは他のプレイヤーの再生で停止する | `test/video-autopause.test.ts:登録したプレイヤーは、他のプレイヤーが再生すると停止する` | unit | PASS |
| 2 | 再生を開始した本人は停止しない | 同上:`再生を開始した本人は停止しない` | unit | PASS |
| 3 | 登録した複数のプレイヤーが同時に停止する | 同上:`登録した複数のプレイヤーが同時に停止する` | unit | PASS |
| 4 | 再生した本人以外だけが停止する | 同上:`再生した本人以外だけが停止する` | unit | PASS |
| 5 | 登録解除したプレイヤーは停止しない（unmount 後に呼ばれない） | 同上:`登録を解除したプレイヤーは停止しない` | unit | PASS |
| 6 | 未登録（autopause 無効）のプレイヤーは停止しない | 同上:`登録していないプレイヤーは停止しない` | unit | PASS |
| 7 | 二重登録しても一度しか呼ばれない | 同上:`同じ停止関数を二重に登録しても一度しか呼ばれない` | unit | PASS |
| 8 | 別々に取得した composable が同じ登録簿を共有する | 同上:`別の呼び出しで得た register でも同じ登録簿を共有する` | unit | PASS |
| 9 | 既存の SSR スモークが壊れていない | `test/basic.test.ts:renders the index page` | e2e | PASS |

## カバレッジ

**計測していない。** このリポジトリに `@vitest/coverage-v8` が入っておらず、
カバレッジ用の npm script も無い。この変更のためだけに devDependency を
足すのは計画の範囲外と判断した。

計測の代わりに言えること: `video-autopause.ts` の公開関数は `register` と
`notifyPlay` の 2 つで、両方とも上記 8 件のテストが通っている。分岐は
`pause === self` の 1 箇所のみで、真・偽の両方をテスト 2 と 4 が踏んでいる。

## 意図的に検証していないこと

- **`VideoPlayer.vue` のユニットテスト**。このリポジトリにコンポーネントテストの
  前例が無く、`@vue/test-utils` の導入を伴う。今回の変更の大半は `<video>` への
  宣言的な受け渡しで、得られる保証に対して基盤導入のコストが見合わないと判断した。
- **プレイグラウンドでの目視確認**。`npm run dev` でブラウザを開く必要があり、
  この作業環境からは確認できていない。`cover` / `background` のレイアウトと
  `autopause` の動作は目視確認が必要。
- **iOS 実機での `playsinline`**。属性が付くところまでしか確認していない。
  実機での挙動はアプリビルド時に確認する。

## 後方互換について

`cover` / `background` のいずれも未指定なら、従来どおり `Ratio wide-screen` を
通る。既存の利用箇所の見た目は変わらない。

唯一の挙動変更は **`playsinline` の既定値 `true`**。従来は iOS で再生時に
全画面へ遷移していたが、それではループ背景として使えないため既定で有効にした。

`autopause` の既定値は `VimeoPlayer` の `true` と異なり `false` にしている。
従来は複数同時再生ができたため、既定を変えると既存の利用箇所の挙動が
変わってしまうため。理由は props のコメントにも残した。

## マージ時のエビデンス

squash する場合は、上記の RED / GREEN のコマンドと結果を PR 本文か
squash コミットの本文へ写すこと。

| コミット | 役割 |
| --- | --- |
| `096cbfc` | RED（autopause の再現テスト） |
| `b319fde` | GREEN（autopause の composable） |
| `94d86aa` | VideoPlayer 本体 |
| `31830ba` | プレイグラウンド |
