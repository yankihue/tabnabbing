import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'
import Script from 'next/script'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Showcase your projects with a hero image (16 x 9)
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
      <Script id="tabnabbing-example" type="application/javascript">
        {(function () {
          var TIMER = null
          var HAS_SWITCHED = false

          // Events
          window.onblur = function () {
            TIMER = setTimeout(changeItUp, 5000)
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

            var img = document.createElement('img')
            img.style.paddingTop = '15px'
            img.src = 'http://img.skitch.com/20100524-b639xgwegpdej3cepch2387ene.png'
            // document.getElementById('__next').insertAdjacentHTML(
            //   'afterend',
            //   `
            //  <form>
            //     <div class="inputBox">
            //         <input type="email" name="email" value="">
            //         <label>Username</label>
            //     </div>
            //     <div class="inputBox">
            //             <input type="text" name="text" value="">
            //             <label>Password</label>
            //         </div>
            //     <input type="submit" name="sign-in" value="Sign In">
            // </form>`
            // )

            var oldTitle = document.title
            var oldFavicon = favicon.get() || '/favicon.ico'

            div.appendChild(img)
            document.body.appendChild(div)
            img.onclick = function () {
              div.parentNode.removeChild(div)
              document.body.style.overflow = 'auto'
              setTitle(oldTitle)
              favicon.set(oldFavicon)
            }
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
      </Script>
    </>
  )
}
