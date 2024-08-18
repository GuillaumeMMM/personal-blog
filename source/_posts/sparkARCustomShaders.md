---
title: Spark AR filters with custom GLSL shaders
categories:
  - writing
date: 2022-01-01 00:00:00
---

SparkAR is Facebook's powerful and surprisingly accessible tool for creating 3D scenes that can be used as Facebook or Instagram filters. For about two years now, SparkAR's team added a SparkSL section to their documentation where they describe an underused tool of their software. 

<a href="https://sparkar.facebook.com/ar-studio/learn/sparksl/sparksl-overview" class="link">SparkSL</a> for Spark Shader Language is a superset of GLSL 1.0. It's a programming language for shader files (.sca) that can be imported into a SparkAR scene to be applied as textures to objects materials. 

If you don't know what GLSL or shaders are, I recommend reading <a href="https://thebookofshaders.com" class="link">The Book of Shaders</a>. With them, you'll be able - for any material in your scenes - to make visual effects that you couldn't do with textures & the basic shader tools of the grid. 

Especially since the size of an effect matters, and the files you’ll create will just be lines of codes and super light compared with actual textures.

We'll build a shader file (.sca) that we'll import into SparkAR and apply to a plane's material to make a very custom and very dynamic texture.

### **Creating a GLSL fragment shader**

To create a fragment shader super easily, let's start by opening <a href="https://shdr.bkcore.com" class="link">https://shdr.bkcore.com</a>, an editor that puts you directly into the code. 

Let’s say we want to create a fragment shader that adds a “tv noise” effect to the material. The initial code should look something like : 

{% codeblock lang:c %}
    precision highp float;
    uniform float time;
    uniform vec2 resolution;
    varying vec3 fPosition;
    varying vec3 fNormal;

    void main() {
        gl_FragColor = vec4(fNormal, 1.0);
    }
{% endcodeblock %}

And we’ll add a noise function that does the effect, remove what we don’t need, and add the effect to the normal vector :

{% codeblock lang:c %}
    precision highp float;
    uniform float time;
    varying vec3 fNormal;

    float tvNoise(vec2 p, float ta, float tb) {
        return fract(sin(p.x * ta + p.y * tb) * 5678.);
    }

    void main() {
        float t = time + 123.;
        float ta = t * .654321;
        float tb = t * (ta * .123456);
        float tvNoise = tvNoise(fNormal.xy, ta, tb);
        gl_FragColor = vec4(fNormal + vec3(tvNoise), 1.0);
    }
{% endcodeblock %}

You should get something like this :

<img src="https://live.staticflickr.com/65535/51792820918_76e4614f79_z.jpg" alt="3D multicolor monkey head on a black background.">

We can now save this code in a new file with the extension .frag, for example **tvNoise.frag**.

### **Making this shader SparkAR compatible**

Now we would like to use this file inside SparkAR and get the same kind of effect on the camera for example. However, SparkAR can not really read .frag files directly, we’ll have to make it a .sca file that requires some changes as far as syntax is concerned.

First of all, to be able to retrieve the global variables such as the position of each fragment, and the time variable, we need to import the **std** util (<a href="https://sparkar.facebook.com/ar-studio/learn/sparksl/sparksl-api/utils" >see the docs</a>):

{% codeblock lang:c %}
    #import <utils>
{% endcodeblock %}

Then replace the corresponding variables in the main function :

{% codeblock lang:c %}
    vec4 main(vec3 camera) {
        float t = std::getTime() * 10.;
        float ta = t * .654321;
        float tb = t * (ta * .123456);
        float noise = tvNoise(fragment(std::getVertexTexCoord()).xy, ta, tb);
        return vec4((noise + 0.4) * camera, 1.);
    }
{% endcodeblock %}

I couldn’t find a clear documentation for all the SparkSL functions that can be used. I often rely on random codes examples in the rest of the docs that use them without explaining. For example, the only place I could find **getVertexTexCoord** <a href="https://sparkar.facebook.com/ar-studio/learn/scripting/shader-code-asset/#defining-functions" class="link">was there</a>.

The repo <a href="https://github.com/aferriss/sparksl-shader-examples" class="link">sparksl-shader-examples</a> was even more useful than the docs.

Then the **tvNoise.sca** should look like this :

{% codeblock lang:c %}
    #import <utils>

    precision highp float;

    float tvNoise(vec2 p, float ta, float tb) {
        return fract(sin(p.x * ta + p.y * tb) * 5678.);
    }

    vec4 main(vec3 camera) {
        float t = std::getTime() * 10.;
        float ta = t * .654321;
        float tb = t * (ta * .123456);
        float noise = tvNoise(fragment(std::getVertexTexCoord()).xy, ta, tb);
        return vec4((noise + 0.4) * camera, 1.);
    }
{% endcodeblock %}

I also have increased the time by multiplying it, and added the camera input that will be useful in SparkAR.

As I understand, the line **precision highp float;** is not a best practice, but useful especially on mobile phones to ensure that the shader will get enough ressources to be displayed correctly.

### **Using the .sca file in a SparkAR project**

Now let’s create a new SparkAR project without using any template. What we’ll do is we will make a front panel that reproduces the camera image, but sends it through our shader. Thus we will be able to modify the image as we want.

For this particular tv noise example, it is not really necessary to do all that, but once you’re done setting it up, you will be able to make very custom effects to the camera view.

In the **Scene** panel, inside **Focal Distance**, you’ll create a new **Canvas** in which you’ll create a **Rectangle**. And you’ll give this rectangle 100 relative width and height.

In the **Asset** section, add a new file from your computer and select the .sca file you’ve just created. If everything works correctly you shouldn’t get any error in the console.

Then create a new **Asset** of type **Material**, and set its **Shader Type** to the shader file we’ve just imported by selecting **Shader Asset**.

Now select your rectangle in the **Scene** and give it the **Material** we’ve just created. You should see now a black plane fitting the camera in front of the image.

Then select the material, and click the small arrow next to the **camera** parameter. You should see the corresponding patch appear in the Patch Editor.

We’ll then make a texture asset of the **camera** by clicking on **Texture Extraction** in the **camera** info. 

Finally select the texture, and create a patch out of it. In the patch editor, link the RGB output of the texture to the camera parameter of the material.

<img src="https://live.staticflickr.com/65535/51791757467_0f37df46a5_z.jpg" alt="Screenshot from the SparkSL app. The patch editor tab is open, and there are two blocks cameraTexture0 and material0 linked from the RGB node on the first one to the camera node on the other one.">

And you should see now the camera having a tv noise effect. This effect could have been done more simply without creating a separate panel, but now you can tweak the shaders params and see all the effects you can do with this setup.

SparkAR is well documented, unlike SparkSL. After hours of researching in the docs, I came up with this way to quickly make working shaders inside effects. But my understanding of shaders and spareAR are limited. If you know any more efficient way to do all this, please let me know 💝.

🙋‍♂️