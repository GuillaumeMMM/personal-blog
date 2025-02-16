---
title: Inaccessibility first - frontend development with AI
categories:
  - writing
date: 2025-02-16 00:00:00
---

A non-negligible proportion of developers code with the help of generative AI. According to <a href="https://survey.stackoverflow.co/2024/ai#sentiment-and-usage-ai-select">the 2024 stackoverflow study</a>, 62% of them used AI in the development process during that year, and even more are planning on using it in 2025. That's a reality that should be questioned and challenged, of course, but that should also be analysed as a trend that is not on the way out.

I notice this at work when reviewing pull requests that have completely or partially been written with the help of a generative AI. As one of the developers responsible for ensuring the accessibility of the features deployed to production, I review a lot of the code that's pushed. I'm often surprised by the poor attention to accessible code, especially when it's a snippet that I suspect has been produced with a help of a language model. If we let the AIs code without careful reviews, we would very quickly have less inclusive user experiences.

An AI Assistant does not *think*, it does not *reason* nor does it *hallucinate*. It uses a model that projects text into a space where are identified the most probable following words that would constitute an answer. If you ask it to give a more friendly, more serious or more WCAG 2.2 compliant answer, it will transfer the answer along a vector, and generate another text that will *probably* be more aligned with what is expected.

The web being notoriously a widely inaccessible place, and the generative AI models being trained on it, generated HTML code is most likely inaccessible, thus inaccessible by design. According to <a href="https://webaim.org/projects/million/">webaim.org</a>: 
<blockquote cite="https://webaim.org/projects/million/">
Across the one million home pages, 56,791,260 distinct accessibility errors were detected—an average of 56.8 errors per page. The number of detected errors increased notably (13.6%) since the 2023 analysis which found 50 errors/page.
</blockquote>

As long as the web remains that way (and we are only talking about home pages, not even forms, videos, canvas or data visualisations), there is no way a LLM would provide accessible HTML code. And the situation tends to worsen with code being continuously generated and deployed to the internet.

I have no hope for generative AI to be a net positive for users in the future. I still wanted to see how severe the situation is, so I tried asking DeepSeek, Claude and ChatGPT to build HTML ans JS code for a multiple select form input. And see how far it is from making something accessible. I used the free versions of the models, thus I don't expect the best quality answers (although it should not be that far from it), but it still gives me a good representation of what developers are using.

I provided the following prompt to DeepSeek V3 (I also generated the prompt with a generative AI because that's the level of degeneracy prompt engineers (?) recommend to be at).
<blockquote>
Write HTML and JavaScript code for a multiselect form element. When a user clicks a trigger button, a dropdown should open, allowing the user to select multiple countries from the following options: 'France', 'Italy', 'Spain', and 'Monaco'.
</blockquote>

The model generated the following HTML snippet (along with a ton of javascript, css and explanations): 
```html
<div class="dropdown">
    <button onclick="toggleDropdown()">Select Countries</button>
    <div id="dropdownContent" class="dropdown-content">
      <label><input type="checkbox" value="France"> France</label>
      <label><input type="checkbox" value="Italy"> Italy</label>
      <label><input type="checkbox" value="Spain"> Spain</label>
      <label><input type="checkbox" value="Monaco"> Monaco</label>
    </div>
</div>
  ```
  
I'll be honest it looks better that what I expected. It at least did use appropriate semantic HTML tags! But that's all there is to say that's good about it. The keyboard inputs are off, the dropdown pattern is nonexistent, the opening and closing are not announced to assistive technologies, the dropdown closes when an item is checked etc.
  
It is really not good, and good luck debugging why, when you have this multiselect in a form and you press "Enter" while focused anywhere, the dropdown opens instead of submitting... (A `button` has the default type "submit", and pressing "Enter" triggers the first submit button within the `form` tag.)

"Hey but you should not expect it to work as is, it should help you get to a viable solution. Also good prompting would involve asking it for an accessible experience!"

If I'm using a generative AI to build an HTML component, I probably have limited knowledge of how to do it. And the chances that I would go deeper than the visual aspect and an acceptable mouse experience are low. But let's give DeepSeek another chance, maybe the secret sauce of a11y prompting is to ask explicitly that we want HTML that works for everyone. My guess is that we have to tell it exactly what to do, so much that writing the code yourself is faster.

<blockquote>
Hey it seems that this code is not very accessible. I want to create a user experience that is as inclusive as possible. Do you think you could re-write the code but with that in mind ?
</blockquote>

And I got this HTML snippet:
```html
<div class="dropdown">
    <button
      id="dropdownButton"
      class="dropdown-button"
      aria-haspopup="true"
      aria-expanded="false"
      onclick="toggleDropdown()"
      onkeydown="handleButtonKeydown(event)"
    >
      Select Countries
    </button>
    <div
      id="dropdownContent"
      class="dropdown-content"
      role="menu"
      aria-labelledby="dropdownButton"
    >
      <label role="menuitemcheckbox" tabindex="0">
        <input type="checkbox" value="France" onchange="updateSelectedCountries()"> France
      </label>
      <label role="menuitemcheckbox" tabindex="0">
        <input type="checkbox" value="Italy" onchange="updateSelectedCountries()"> Italy
      </label>
	  //  [...]
    </div>
  </div>

  <p>Selected Countries: <span id="selectedCountries" aria-live="polite"></span></p>
  ```
Let's gooo, so many more attributes <span aria-hidden="true">💖</span>! As a developer who doesn't know much about accessibility but who cares about providing an inclusive experience, I might stop there and consider that my job is done. Unfortunately, this HTML code is almost as bad as the initial snippet. It is a mess of patterns projected through attributes on those poor HTML tags.

As I am myself not a WCAG expert, I might not be able to explain all the intricacies of what patterns that code is going for. If I'm careless or pressured by time, I'm more inclined to trust what the chatbot generated. 

What I am used to saying to junior frontend developers who tend to write a lot of code is that they should be able to explain every line they write. When creating a pull request, I recommend that they re-read every change and are ready to justify every change.

You can ask the AI to generate text explaining every piece of a line of code, but it will not question its own quality unless you force it to. You have to do the work yourself in the end, there is no escaping for reading the docs of what the `role="menu"` does, or for example I asked:

<blockquote>
Can you explain this line in more details: 
```
<label role="menuitemcheckbox" tabindex="0"> <input type="checkbox" value="Monaco" onchange="updateSelectedCountries()"> Monaco </label>
```
</blockquote>

DeepSeek answered with 100 lines of explanation of what every little piece does. It's crazy to have been trained on all of the docs that exist, being able to restitute them on the fly, but still consider that `tabindex="0"` on a label containing a checkbox input (that btw is the element bearing the `onchange` attribute) is any good. And I'm not mentioning that the misuse of roles `menu` and `menuitemcheckbox`.

I have asked the same questions to ChatGPT and Claude, and got same kind of results with and without accessibility encouragements. And I'll spare you the 200+ lines per chatbot of *reasoning* that lead nowhere.

It doesn't work and it cannot work, LLMs are made to restitute a well formed soup of all the things that seemed to be valuable code in the training sets. I even less believe now that coding assistance can do more than what automated accessibility testing already does. 

It is so assertive though... It takes so much effort to convince stakeholders that real people should be spending time working on accessibility that I'm pretty sure LLMs will be the easy yet broken solution in the next few years. Good news: after the bubble bursts my job will still exist, bad news: user experience will suffer.