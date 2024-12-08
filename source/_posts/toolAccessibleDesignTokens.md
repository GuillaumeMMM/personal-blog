---
title: A Tool for Creating More Accessible Design Tokens
categories:
  - writing
date: 2024-12-08 00:00:00
---

Building an internal design system at my company is an exciting position as it pushes me to dig into the frontend and design decisions history as much as it frees space to reorganise parts of the apps. 

Both frontend engineers and product designers work to bridge the gap between today's users needs and yesterday's users needs, and the design system is a powerful lever for achieving this.

 At my company, the design system started with a set of design tokens. Crafting a cohesive system of tokens is challenging since it must be understood by everyone as clearly and quickly as possible. And each set of tokens comes with its own challenges. For instance when choosing colours for a product, considering the contrast ratio in-between text colours and background colours is essential.

Yesterday's user and today's share the need for an accessible experience. Measuring accessibility is tricky, and companies are often more interested in measuring the conformity to a norm. A number of guidelines can be considered : (Globally <abbr title="Web content accessibility guidelines">WCAG</abbr> 2.2, and in my context the French guidelines RGAA (<a href="https://accessibilite.numerique.gouv.fr/">Référentiel Général d'Amélioration de l'Accessibilité</a>) and the Luxembourgeois guidelines RAAM (<a href="https://accessibilite.public.lu/fr/raam1/referentiel-technique.html">Référentiel d’Accessibilité des Applications Mobiles</a>)). These guidelines can be cryptic and asserting the conformity of the hundreds of criteria takes forever. 

As far as colour contrast is concerned, each have its own way of assessing the accessibility of text over a background. The ratio itself is (for now, and as far as I know) aligned with WCAG 2.2 AA criteria, but the definition of "large text" varies.

To overcome the complexity of assessing the conformity of a set of colour design tokens to various accessibility guidelines, I built a <a href="https://www.contrastcheckergrid.com">design tokens contrast checker grid that is available here</a>. <a href="https://contrast-grid.eightshapes.com/">This type of tool already exists<a>, but they are very often inaccessible themselves and don't offer options for alternative validation methods. Also I don't know if there is a colour contrast grid trend right now but <a href="https://codepen.io/davatron5000/pen/YzmwEZZ?editors=0010">Dave Rupert just created a codepen contrast grid</a>.

The options of the first version of my website are limited, but I plan on adding more tokens import options and more contrast checking mechanisms. A question has kept me up at night (at least one night, reading through github drama). WCAG 3 is being discussed, and I'd like to be up to date with the official contrast verification guidelines. Especially because it will likely include a new method of verification, and it will diverge from the French RGAA to which my company will still need to comply to. 

In <a href="https://www.w3.org/WAI/GL/WCAG3/2021/how-tos/visual-contrast-of-text/">the WCAG docs</a> another algorithm is mentioned : <a href="https://github.com/Myndex/SAPC-APCA">APCA</a>. It's a promising method that takes into consideration the non-linearity of human perception when looking at colours. However <a href="https://github.com/w3c/silver/issues/574">some people raised concerns<a> regarding the method, and <a href="https://github.com/w3c/wcag3/issues/10">other techniques might be under examination</a>. Yet some people think that <a href="https://medium.com/@Marindessables/apca-r%C3%A9volution-dans-la-mesure-du-contraste-de-couleurs-pour-une-accessibilit%C3%A9-am%C3%A9lior%C3%A9e-c44e0b3f7c81">APCA it is going to be the WCAG 3 choice</a> for sure. Although the last update <a href="https://yatil.net/blog/wcag-3-is-not-ready-yet">in Eric Eggert's blog post about WCAG 3</a> states that according to the Accessibility Guidelines Working Group Co-Chair: "APCA is not in the current draft".

Adding that algorithm to the checker I built could be very useful, regardless of whether it's included in WCAG 3. But it seem impossible to officially implement an APCA tester <a href="https://git.apcacontrast.com/documentation/minimum_compliance.html">without stating what the author wants</a>. I'm not sure I understand the need for an integration compliance document for an algorithm that would be part of an official WCAG. To be continued..