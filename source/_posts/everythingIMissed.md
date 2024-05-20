---
title: Everything I missed
categories:
  - writing
date: 2024-05-20 00:00:00
---

Last time I worked on this website, I was confident I had built something clean, well designed and accessible. Returning to it after a year learning about accessibility, I realize I had made a few mistakes.

Making websites accessible is challenging. I work at a company that needs to comply with the <abbr title="Référentiel général d'amélioration de l'accessibilité">RGAA</abbr> (the French guidelines for web accessibility). It’s a set of rules inspired by <abbr title="Web content accessibility guidelines">WCAG</abbr>, the latest version being equivalent to AA in terms of compliance. However it presents things a bit differently.

The French guidelines seem to give more room for interpretation. Last week in the RGAA mailing list exchanges someone asked if in a form (in French) with an email field, the label « E-mail » is clear enough, or if giving an explicit example is required. One would expect that there are enough email inputs out there to know the best practice for accessible labels. 
(After endless yet gripping discussions, consensus seems to lean toward the additional format example. One reason being that in French, there are a ton of ways to say « E-Mail »)

Thus, the habits I have regarding accessibility may not be the same as someone working with WCAG (and I'd love your feedback on that!). Here’s the things I had to fix to make this website more accessible.

<br>

### Emoji
I had a bunch of <i>emoji</i> that were interpreted by assistive technology as words although they are decorative. If the interpreted text does not make sense, it's important to either add an outer span with alternative text or ignore the <i>emoji</i> with `aria-hidden="true"`. I now even avoid using them to convey meaning because they don’t look the same based on context.

<br>

### Links
Before my review, all the links would open in a new tab without any indication. Opening a link in a new tab should not be the default behavior. When I learned that `target="_blank"` would do just that, I started using it everywhere. But users should be able to choose how they want a link to open, and opening in a new tab can be disorienting for someone navigating with assistive technology. 

I’m using hexo as a blog templating tool, and the build step sets all links as opening in a new tab. To fix that, I explicitly set all blog posts links to open in the current tab, and for the few links left opening in a new tab I added an icon next to the link with an accessible text describing the behavior.

I also had some links with the url as a name. Showing the full url as the name of a link will force the assistive technology to interpret all the characters. Thus I made sure links all have explicit names.

<br>

### Text
I had my default `font-size` set to 16 pixels on both the `html` and `body` elements. I don't remember if I added that myself or if it was already in the CSS reset file I copy-pasted from somewhere, but it's not good! The default `font-size` of the website should not be set in pixels, otherwise changing the default `font-size` at the browser level will not have any effect on how the text is displayed.

Also I had my line height set to one time the size of the font. Line height should be greater than 1.5 times the font-size to make it easier to read.

<br>

### Page
My blog post pages all had the same title as the home page. All pages should have explicit titles and the information they provide should start with the things most related to the current context. That way a person reading the title from another tab knows faster what's on the page.

I did add a `lang="en"` to my pages, but I forgot that some of my posts are in French... Therefore I set the `lang` attribute around the French text in my blog posts.

<br>

### Alt text
Last but not least, over the years I've added collections of photos without considering alternative text for images. I had added the `alt` attribute but with meta information. Now all photos and images have a proper description of what's to be seen in them.

<br>

Now, I'm pretty confident I have a clean, well designed and accessible website. See you next year for a new set of fixes <span aria-hidden="true">😎</span>.