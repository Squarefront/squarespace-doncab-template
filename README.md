# Squarespace Doncab
> Squarespace's Doncab template, the template that powers York, Lange, and Shibori.

> **Note:** This is not an official Squarespace template repository.



## Overview
Doncab is a feature-packed template with large grid-style layouts, a custom project collection, viewport-sized typography and buttery smooth page transitions. This repository is not an official distribution of the template. At Squarefront we're simply tracking changes ourselves to keep up to date on template updates.



## Template Information

As you might already know, Squarespace's [official template store](http://squarespace.com/templates) contains templates that are sometimes powered by the same template code base.

York template currently powers the following Squarespace template starting points.

* [York](http://york-demo.squarespace.com)
* [Lange](http://lange-demo.squarespace.com)
* [Shibori](http://shibori-demo.squarespace.com)



## Interesting Points

### Local JSON Variables
This is the first template framework that has introduced JSON local variables. Although undocumented as of the release of the template, there's a good chance that this will be a supported and documented feature.

> Example: https://github.com/Squarefront/squarespace-doncab-template/blob/master/blocks/project-banner.block#L1

The use-case for these are quite impressive. Essentially you can store a JSON value outside of current template scope, then take the variable anywhere in your template. It appears there are some limitations to variables, in that they only exist in the current template file you're in, hence the name "local variables". Also, you cannot take a variable into a Squarespace Query or Related Items Query.

#### How it works
* **Step One:** Set a JSON variable in a Layout, Collection or Block template file: `{.var YOUR_VAR_NAME A_JSON_VALUE}`
    * Example: `{.var myTitle collection.title}`
* **Step Two:** Use your variable: `{@myTitle}`

This is great for storing values that you want to take deeper into scope.

### Navigation Tags without Templates
This is the first template framework that has demonstrated the usage of a navigation tag without a navigation template.

> Example: https://github.com/Squarefront/squarespace-doncab-template/blob/master/site.region#L10

This creates some really great uses all across the board. Instead of building a dedicated .block template for your navigation, you can scope into a navigation tag using this method.

#### How it works
If you've used navigation tags before, simply remove the template attribute and create a closing navigation tag like below. Within the navigation tag you will scope into the navigationId you've set. The following example could exist almost anywhere in your template.

```html
<squarespace:navigation navigationId="mainNav">
    <script>console.log({@|json-pretty});</script>
</squarespace:navigation>
```


## License and Terms

This template is a copy of Squarespace's own template for the purposes of tracking development updates. This template code is subject to Squarespace's [Developer Template License](https://www.squarespace.com/template-license/).



## Release Notes

* Initial Release - March 29, 2016 - York/Lange template release for Website or Commerce plans.
* Misc Code Updates - April-May - Check commit history, there's been considerable updates all across the board including some removal of CSS classes.
* New Template Starting Point - May 13 - [Shibori Template](http://shibori-demo.squarespace.com)