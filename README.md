# VulnBoard - 脆弱性学習用掲示板

## プロジェクト概要

セキュリティ脆弱性を学習するための意図的に脆弱な掲示板アプリケーション。
HTML + CSS + JavaScript のみで構成され、実際の脆弱性診断の練習対象として使用できる。

**⚠️ 警告: このプロジェクトは意図的に脆弱性を含んでいます。実際のプロダクション環境では絶対に使用しないでください。**

## プロジェクト名

**VulnBoard** (Vulnerable Message Board)

## 技術スタック

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage (データ永続化)

## 主要機能

### 1. ユーザー機能
- ユーザー登録
- ログイン/ログアウト
- プロフィール編集

### 2. 投稿機能
- スレッド作成
- スレッドへの返信
- 投稿の編集・削除（自分の投稿のみ）

### 3. 検索機能
- スレッドタイトル検索
- 投稿内容検索

### 4. 管理者機能
- 全投稿の削除権限
- ユーザー管理画面

## 意図的に含める脆弱性

### Phase 1: 基本的な脆弱性

1. **XSS (Cross-Site Scripting)**
   - innerHTML を使用した投稿内容の表示
   - URLパラメータの直接表示
   - 入力値のサニタイゼーションなし

2. **不適切な認証・認可**
   - クライアント側のみでの認証チェック
   - セッション情報を localStorage に平文保存
   - 管理者フラグをクライアント側で管理

3. **CSRF (Cross-Site Request Forgery)**
   - CSRFトークンなし
   - 重要な操作に対する再確認なし

### Phase 2: 中級の脆弱性

4. **Injection系**
   - 検索機能での不適切な文字列処理
   - eval() の使用

5. **情報漏洩**
   - エラーメッセージに機密情報を含む
   - ソースコードにコメントでパスワードヒント
   - 他ユーザーのデータが取得可能

6. **不適切なアクセス制御**
   - URLを知っていれば誰でもアクセス可能
   - 他人の投稿を編集・削除可能

### Phase 3: 応用的な脆弱性

7. **DOM-based XSS**
   - location.hash の不適切な処理
   - postMessage の不適切な処理

8. **Open Redirect**
   - リダイレクト先の検証なし

9. **Clickjacking**
   - X-Frame-Options ヘッダーなし（iframe で埋め込み可能）

## データ構造

### Users (localStorage: 'vulnboard_users')
```javascript
{
  userId: string,
  username: string,
  password: string, // 平文保存
  email: string,
  isAdmin: boolean,
  createdAt: timestamp
}
```

### Threads (localStorage: 'vulnboard_threads')
```javascript
{
  threadId: string,
  title: string,
  content: string,
  authorId: string,
  authorName: string,
  createdAt: timestamp,
  replies: [
    {
      replyId: string,
      content: string,
      authorId: string,
      authorName: string,
      createdAt: timestamp
    }
  ]
}
```

### Session (localStorage: 'vulnboard_session')
```javascript
{
  userId: string,
  username: string,
  isAdmin: boolean,
  loginTime: timestamp
}
```

## ページ構成

1. **index.html** - トップページ（スレッド一覧）
2. **login.html** - ログインページ
3. **register.html** - ユーザー登録ページ
4. **thread.html** - スレッド詳細・返信ページ
5. **new-thread.html** - 新規スレッド作成ページ
6. **profile.html** - プロフィール編集ページ
7. **admin.html** - 管理者ページ
8. **search.html** - 検索ページ

## UI/UX

- レトロな掲示板風デザイン（2000年代風）
- シンプルで見やすいレイアウト
- レスポンシブ対応（最低限）

## 攻撃デモ例

このプロジェクトで実演できる攻撃:

1. **XSS攻撃の実演**
   - `<script>alert('XSS')</script>` を投稿に含める
   - `<img src=x onerror="alert('XSS')">` でイベントハンドラ経由
   
2. **セッションハイジャック**
   - localStorage から認証情報を取得
   - 他人のアカウントで操作

3. **権限昇格**
   - ブラウザコンソールで `isAdmin: true` に変更
   - 管理者権限で操作

4. **CSRF攻撃**
   - 外部サイトから削除リクエストを送信

5. **情報漏洩**
   - localStorage から全ユーザー情報を取得
   - 他人のパスワードを閲覧

6. **DOM-based XSS**
   - URLハッシュに悪意あるスクリプトを埋め込み

## 攻撃シナリオ例

### シナリオ1: XSS攻撃
1. 新規スレッドを作成
2. タイトルに `<script>alert(document.cookie)</script>` を入力
3. スレッド一覧を開くと、全ユーザーにアラートが表示される

### シナリオ2: セッションハイジャック
1. ブラウザのDevToolsを開く
2. Application > Local Storage で `vulnboard_users` を確認
3. 他ユーザーのパスワードが平文で見える
4. `vulnboard_session` を書き換えて他人になりすます

### シナリオ3: 権限昇格
1. 通常ユーザーでログイン
2. DevToolsのConsoleで `localStorage.setItem('vulnboard_session', JSON.stringify({...JSON.parse(localStorage.getItem('vulnboard_session')), isAdmin: true}))` を実行
3. ページをリロード
4. 管理者権限で操作可能になる

### シナリオ4: CSRF攻撃
1. 外部HTMLファイルに削除リクエストを仕込む
2. ログイン中のユーザーにそのページを開かせる
3. 知らない間に投稿が削除される

### シナリオ5: DOM-based XSS
1. URLに `thread.html#<img src=x onerror=alert('XSS')>` を設定
2. そのURLを他ユーザーに送信
3. 開いた瞬間にスクリプトが実行される

## プロジェクトの目的

このプロジェクトは、**脆弱な実装がどのように攻撃されるか**を視覚的に示すためのデモアプリケーションです。

- 「innerHTML を使うとこう攻撃される」
- 「クライアント側だけの認証だとこうやって突破される」
- 「localStorage にパスワードを保存するとこう見られる」

といった具体例を実際に動かして見せることができます。

## ライセンス

教育目的のみで使用してください。
本プロジェクトを使用して発生したいかなる問題についても責任を負いません。

## 使用方法

1. ローカル環境でHTMLファイルを開く
2. 各攻撃シナリオを実際に試してみる
3. DevToolsで内部動作を確認する
4. 「なぜこれが危険なのか」を説明する教材として使用

## 注意事項

- **教育・デモ目的のみ**で使用してください
- ローカル環境でのみ使用してください
- インターネットに公開しないでください
- 実際のユーザーデータを入力しないでください
- このコードを実プロダクトで使用しないでください
