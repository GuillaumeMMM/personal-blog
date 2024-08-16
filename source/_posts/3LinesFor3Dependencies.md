---
title: 3 lines for 3 dependencies
categories:
  - writing
date: 2024-08-15 00:00:00
---

At work this week we noticed that the package `react-autosize-textarea` of our React frontend app had dependencies that were not kept up to date. A quick look at the <a class="link" target="_self" href="https://github.com/buildo/react-autosize-textarea">github repository</a> showed that the last release was in 2018 and that it has been archived in March of this year. Which led us to look into why we needed that library 🤔

The `react-autosize-textarea` library exports a React component named "TextArea" rendering a regular `<textarea>` HTML tag which height will resize based on its content so that a user will not have to scroll vertically within the input. It receives 3 props : the minimum height in rows, the maximum height in rows and a `onResize` callback.

Among the three dependencies of this package, there is "line-height" that gets the actual `line-height` of the text within the input and with which is computed the max height allowed. And another dependency named "autoresize" that actually does the work of computing the height of a `<textarea>` so that it matches the inner `scrollHeight`. Our `react-autosize-textarea` does not much besides being the React abstraction of the "autoresize" package.

After looking at what's done in <a class="link" target="_self" href="https://github.com/jackmoore/autosize/blob/master/src/autosize.js">autosize</a> and the <a class="link" target="_self" href="https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848">various articles</a> <a class="link" target="_self" href="https://css-tricks.com/auto-growing-inputs-textareas/">on the web</a>, we found a  simple and accessible solution to replace the library. 

On a side note, we excluded these solutions : computing the inner height with the number of "\\n" occurrences does not work because of blocks of text that are displayed on multiple lines, and the `contenteditable`  `span` solution doesn't work for us either because the French accessibility guidelines (RGAA: Référentiel Général d'Amélioration de l'Accessibilité) makes us build a UI that also works with CSS disabled (in which case the fake input cannot be identified as an input anymore).

Within our React TextArea component, we have a `ref` on the HTML input named "textAreaRef" and a `rows` prop that's passed to the input.

```js
function updateTextAreaHeight() {
    if (textAreaRef.current) {
      //  Reset the textarea height to its initial value based on the 'rows' props before reading the scrollHeight
      //  so that the input is able to shrink back to its smallest height
      textAreaRef.current.style.height = `unset`

      const scrollHeight = textAreaRef.current.scrollHeight
      textAreaRef.current.style.height = `${scrollHeight}px`
    }
  }
```

We update the size of the input on init of the React component and whenever the value of the input changes. Inspired by what's done in the "autoresize" repository, we use the `scrollHeight` trick to know the actual height of the content. And we reset the height to `unset` and not `0` so that our `rows` props is still the minimum height.
Now if we wanted a maximum we could simply compute the maximum height in pixels based on the line-height that's obtained by dividing the `<textarea>` height when its height is `unset`, knowing the minimum number of rows. Something like :

```js
//  ...
const clientHeight = textAreaRef.current.clientHeight
const maxHeight = (maxRows * clientHeight) / rows

const scrollHeight = textAreaRef.current.scrollHeight
textAreaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
```

That solution may not work for everyone, but the minimal React use case does not require any third party library, unless there's a need for a more robust browser compatibility. The solution we choose is not cutting-edge technology, then why did we choose to download that library in the first place ?

In an older codebase such as ours where most of the code was written by people that are not here anymore, it's hard to find precise answers. But I'm not surprised by the initial decision. As a frontend team we are fighting against wild libraries that have been installed in the last 6 years and that we have to maintain today.

I suspect that there are 3 different problems here :
1. Everyone is focused on their team's delivery and not enough people do the tedious work of monitoring and evaluating each dependency on a regular basis.

2. Many frontend developer think that installing a library is - most of the time - the best solution to their day-to-day delivery problem. I've had the same debate multiple times : beyond all security/bundle size questions, is installing a dependency more maintenance work or less maintenance work ? 
   
   I believe it is more maintenance most of the time. Every week we have dependabot failing at upgrading some library for reasons completely unrelated to the 3 lines of code that we actually depend on. While I have multiple examples in the codebase of homemade snippets that have never changed and that were chosen instead of a third party library. Because the 3 lines that we wrote ourselves match exactly what we need them for.
   
   Now, there seem to be two reasons for people to prefer installing new dependencies : it is very satisfying. In the React ecosystem, it is especially easy to plug in a new library that brings a lot of value to the user immediately with limited costs (reading a few lines of documentation).
   
   Also people have taken the gaussian meme of dependencies a little too seriously : as a junior developer, you start by installing all possible packages. Then you understand that making everything yourself offers more control i.e. customisation and optimisation. And eventually you realise that some harder things have already been solved and that you shouldn't reinvent the wheel every single time. 
   
   The thing is there is a nuance to the last stage : identifying what's hard enough to do so that it is worth all the maintenance, security, accessibility, code size questions is subtle. For example, building a complex dropdown menu from scratch may not be worth it for accessibility reasons. Or building your own highly customisable range picker if you have 1 week sprint to make it work.

3. The systematic need for React wrapper library is a little extreme. We probably shouldn't use them as much as we do because we all know enough how a React component lifecycle works to build our own. And when I see that <a class="link" target="_self" href="https://www.npmjs.com/package/react-autosize-textarea">react-autosize-textarea</a> has 150 000 weekly downloads I'm scared.
   
We all try to be careful and to make the best decisions for the future of the codebase. The evaluation of existing packages and the discussion around the new dependencies should happen. And since we may be at a point in time where the well used React wrappers maintainers communities are progressively dying after 5 to 10 years of loyal services, let's be even more careful 👀.