# Row / Column の width: auto を外す TDD 記録

**対象**: `.row` / `.column` の基本クラスから `width: auto` を外し、Ratio の中の FileUpload の幅が 0 になる不具合（#7）を直す
**ブランチ**: `fix/row-column-width-auto`（基点 `0451fc8` = v4.22.1）
**計画の出所**: 会話上で合意した実装計画（`*.plan.md` は作成していない）。#7 のコメントにある `fit` 案は採らず、根本の宣言を外す案にした

## 背景

website の CMS で画像を選ぶ FileUpload の幅が 0 になった（Elama-LLC/website#126）。
website は `Ratio` > `div.imageFileUpload`（`width: 100%`）> `FileUpload`（`width: 100%`）と入れ子にしている。

`Ratio` は中身を `Row.ratio-container-inner` で包み、`.ratio-container-inner { width: 100% }` で幅を決めている。
ところが `.row { width: auto }` も同じ詳細度 (0,1,0) で同じ要素に当たるため、CSS の出力順だけで勝敗が決まる。
ビルド後の CSS は `Row.*.css` / `Ratio.*.css` のようにコンポーネントごとのチャンクに分かれ、必要になった時点で読み込まれる。
そのため、どのページから入りどう遷移したかで `.row` が後に来ると、内側の Row が中身の幅まで縮み、幅 100% の FileUpload も 0 になる。

`width: auto` は `width` の初期値なので、宣言を外して変わるのは「同じ要素に別の幅指定があり、出力順で負けていた箇所」だけ。

## ユーザージャーニー

1. CMS の編集者として、画像を選ぶ枠がどの画面から開いても同じ大きさで表示されてほしい
2. 実装者として、Row / Column に付けた自分のクラスの幅指定が、読み込み順に関係なく効いてほしい
3. 実装者として、`fit` / `fit-w` / `inline` など幅を決める props の挙動は変わらないでほしい

## タスクごとの記録

### タスク 1: 基本クラスから width を外す（TDD）

カスケードそのものはブラウザが無いと確かめられない。このリポジトリにブラウザを使うテストの基盤は無いため、
`test/layout-width.test.ts` で `Row.vue` / `Column.vue` の SCSS を `sass` でコンパイルし、原因となる宣言が基本クラスに無いことを確かめる。
あわせて、修飾クラス（`_fit` / `_fitW` / `_autoWidth` / `_inline`）の幅指定が残っていることも確かめ、消しすぎを防ぐ。

| 段階 | コマンド | 結果 |
| --- | --- | --- |
| RED | `npx vitest run test/layout-width.test.ts` | `Tests 2 failed \| 3 passed (5)` / `'Row' > 基本クラスは width を宣言しない`・`'Column' > 基本クラスは width を宣言しない` が `expected [ 'width: auto' ] to deeply equal []` |
| GREEN | 同上 | `Test Files 1 passed (1)` / `Tests 5 passed (5)` |
| lint | `npx eslint .` | 終了コード 0 |
| テスト（全体） | `npx vitest run` | `Test Files 4 passed (4)` / `Tests 20 passed (20)` |
| 型チェック（本体） | `npx vue-tsc --noEmit` | エラー 15 件。すべて今回触っていないファイル（`TreeMenu.vue` 10、`text-segmenter.ts` 4、`VimeoPlayer.vue` 1） |

RED は狙った宣言（`width: auto`）が残っていることによる失敗で、テスト基盤の不備によるものではない。
最初の実行は worktree に `.nuxt/` が無く `TSConfckParseError` で落ちたため、`npm run dev:prepare` で生成してから取り直した（この失敗は RED に数えていない）。

コミット: `bbf43bc`（RED）→ `91412a4`（GREEN）

### タスク 2: playground での実測

`playground/src/pages/layout/ratio.vue` に website と同じ条件（幅 100% の FileUpload を Ratio に入れる）の例を足し、
ビルドした playground をブラウザで開いて幅を測った。修正前の挙動は、`.row { width: auto }` を head の末尾（後から読み込まれた場合）
または先頭（先に読み込まれた場合）に足して再現した。

| 条件 | `.ratio` | 内側の Row | FileUpload |
| --- | --- | --- | --- |
| 修正後 | 392px | 392px | 392px |
| 修正前・`.row` が後から読み込まれる順番 | 392px | 0px | 0px |
| 修正前・`.row` が先に読み込まれる順番 | 392px | 392px | 392px |

ほかのページで「修正前に順番が悪いと幅が変わっていた要素」を数えた結果:

| ページ | 変わる要素 |
| --- | --- |
| `/layout/row` | `Ratio` の内側の Row 10 個（0px → 348px） |
| `/forms/AvatarCropper` | `Ratio` の内側の Row 2 個（0px / 60px → 360px）と Column 1 個（60px → 326px） |

どれも「書いてある幅が効くようになる」方向で、それ以外の要素の幅は変わらない。

コミット: `70b3c9e`

## テストで保証していること

| # | 保証していること | テスト | 種類 | 結果 |
| --- | --- | --- | --- | --- |
| 1 | `.row` の基本ルールに width が無い | `test/layout-width.test.ts` `'Row' > 基本クラスは width を宣言しない` | unit | PASS |
| 2 | `.column` の基本ルールに width が無い | 同 `'Column' > 基本クラスは width を宣言しない` | unit | PASS |
| 3 | `_fit` / `_fitW` / `_autoWidth` の幅指定が Row / Column に残っている | 同 `幅を指定する修飾クラスは残っている` | unit | PASS |
| 4 | `.row._inline` の `width: auto` が残っている | 同 `inline は width: auto のまま残っている` | unit | PASS |

## 既知の残課題

- **幅を指定しない FileUpload を Row に直接入れると 0 になる**: `.fileUpload` のルートは幅を持たず、横並びの flex アイテムとして中身の幅まで縮む。今回の変更とは無関係な既存の挙動で、website は自分で `width: 100%` を当てているので影響しない。FileUpload に既定で幅を持たせるかは別途判断する
- **利用側の目視確認**: 次の 5 箇所は同じ詳細度で幅を書いており、修正後は常にその幅が効く。リリース後にバージョンを上げて確認する
  - website: `Sentence.vue` の `.sentence`（`width: 100%`）と `.sentence-text`（`var(--container-narrow-width)`）、CMS の画像選択
  - tokyo-anime-mart: `.packSlider` / `.helpArticleBody` / `.theFooter`（いずれも `width: 100%`）
- **検証環境の制約**:
  - main の `package-lock.json` が `package.json` と食い違っており（picomatch 4.0.5 / 4.0.7）`npm ci` が通らないため、本体の `node_modules` を symlink して検証した
  - playground の開発サーバは `spawn EBADF` で落ちたため、`nuxi build playground` の成果物を `node` で起動した。symlink のせいでビルド成果物に `vue/server-renderer` が入らず、手で補った
  - playground 側の型チェック（`cd playground && vue-tsc --noEmit`）は実行していない
