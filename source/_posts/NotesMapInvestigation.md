---
title: An interactive map for investigative journalism
categories:
  - writing
date: 2022-09-07 00:00:00
---

In the beginning of 2022, I have built for the <a href="https://forbiddenstories.org">Forbidden Stories</a> platform their one year anniversary map of the <a href="https://forbiddenstories.org/about-the-pegasus-project/">Project Pegasus</a> initial release. They wanted to make accessible the data related to the (sometimes potential) victims and (sometimes potential) clients of the Pegasus spyware.

The revelations being international and based on geographic data we built a web interactive world map. The experience is split in two distinct parts. First is the explanatory part with a scrollytelling identifying the events that occured during and after the revelations. And then an exploratory part where the user is given full access to the world map so that they find detailed description of every country’s involvement.

<!-- <a href="https://forbiddenstories.org/pegasus-project-impacts-map/">The result is available here.</a> -->

<img src="https://live.staticflickr.com/65535/52341331315_456c3daaab_z.jpg" alt="Screenshot of the app where we see a map of the world centered on the atlantic ocean. Every country is grey besides France, Hungary, Israel and El Salvador that are red.">
&nbsp;

## The map

In the context of an international investigative journalism project, every element of the map becomes important and not every question is easy to answer. Especially concerning the map itself.

As far as the map projection is concerned, I worked with d3-geo that offers many projection options. We eventually chose the Natural Earth Projection for how it eases the interactions with the map, and does have a convenient scale for the areas where the main Pegasus Project actions are happening.

Deciding upon which border to display is sensitive and the rules are unclear. We went for the most used borders in French mainstream media maps such as Le Monde ones. For the contention over West Sahara for example, Google Maps “solves” it by displaying different borders based on where you connect from.

<img src="https://live.staticflickr.com/65535/52341204944_92e20ac651_z.jpg" alt="Screenshot of the app where we see a map of the world. All countries that have a (sometimes suspected) role in the Pegasus Project are highlighted.">
&nbsp;

## The accessibility

I’ve had dedicated time to work on improving the accessibility. Accessibility in data visualisation can be tricky because developers are not used to doing it systematically. Many code examples for web dataviz libraries omit the accessible part. 

On the internet, 1-2% of people navigate without having JS enabled (maybe even more when it comes to reading articles as users disable javascript to bypass paywalls). As the data of the app is only be accessible through the interactive map, giving a specific access to the information to these users is primordial. I created a separate website that doesn’t require javascript, and that displays the scrollytelling text, images of the map, and the list of links to all countries texts.

Navigation was another concern. Especially the scrollytelling that is not rare, but its use may not be obvious to all readers. I made sure it would be navigable through scrolling with mouse or arrows, TAB, and with buttons. The scrollytelling being displayed as an intro to the exploration of countries, I made sure it’s skippable and that the user can come back to it at any time.

I tested the app with VoiceOver to make sure it’s usable with at least one screen reader to eliminate the most serious mistakes. I know that VoiceOver is not the most used, and that all screen readers don’t work the same way. One of my regrets about this project was not having enough time before release to do it.