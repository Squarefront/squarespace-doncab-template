# Squarespace Doncab
> Squarespace's Doncab template, the template that powers York.

> **Note:** This is not an official Squarespace template repository.



## Overview
Doncab is a feature-packed template with large grid-style layouts, a custom project collection, viewport-sized typography and buttery smooth page transitions. This repository is not an official distribution of the template. At Squarefront we're simply tracking changes ourselves to keep up to date on template updates.



## Template Information

As you might already know, Squarespace's [official template store](http://squarespace.com/templates) contains templates that are sometimes powered by the same template code base.

York template currently powers the following Squarespace template starting points.

* [York](http://york-demo.squarespace.com)



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



## License and Terms

This template is a copy of Squarespace's own template for the purposes of tracking development updates. This template code is subject to Squarespace's [Developer Template License](https://www.squarespace.com/template-license/).



## Release Notes

* Initial Release - March 29, 2016 - York template release for Website or Commerce plans.