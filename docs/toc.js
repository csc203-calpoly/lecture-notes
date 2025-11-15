// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="01_intro_to_java/index.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded "><a href="02_arithmetic_and_testing/index.html"><strong aria-hidden="true">2.</strong> Arithmetic and testing</a></li><li class="chapter-item expanded "><a href="03_lists_maps_existing_classes/index.html"><strong aria-hidden="true">3.</strong> Lists, maps, and existing classes</a></li><li class="chapter-item expanded "><a href="04_oop_and_procedural/index.html"><strong aria-hidden="true">4.</strong> Object-oriented and Procedural programming</a></li><li class="chapter-item expanded "><a href="05_method_dispatch/index.html"><strong aria-hidden="true">5.</strong> Method dispatch</a></li><li class="chapter-item expanded "><a href="06_class_design_process/index.html"><strong aria-hidden="true">6.</strong> A class design process</a></li><li class="chapter-item expanded "><a href="07_interfaces/index.html"><strong aria-hidden="true">7.</strong> Interfaces</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="08_interfaces_part_2/index.html"><strong aria-hidden="true">7.1.</strong> Interfaces, part 2</a></li><li class="chapter-item expanded "><a href="09_interfaces_part_3/index.html"><strong aria-hidden="true">7.2.</strong> Interfaces, part 3</a></li></ol></li><li class="chapter-item expanded "><a href="10_abstract_classes/index.html"><strong aria-hidden="true">8.</strong> Abstract classes</a></li><li class="chapter-item expanded "><a href="11_inheritance_equality/index.html"><strong aria-hidden="true">9.</strong> Inheritance and equality</a></li><li class="chapter-item expanded "><a href="12_hashCode/index.html"><strong aria-hidden="true">10.</strong> hashCode</a></li><li class="chapter-item expanded "><a href="13_comparable_comparator/index.html"><strong aria-hidden="true">11.</strong> Comparables and Comparators</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="13_comparables/index.html"><strong aria-hidden="true">11.1.</strong> Comparables</a></li><li class="chapter-item expanded "><a href="14_comparators/index.html"><strong aria-hidden="true">11.2.</strong> Comparators</a></li></ol></li><li class="chapter-item expanded "><a href="15_lambdas/index.html"><strong aria-hidden="true">12.</strong> Lambdas and functional interfaces</a></li><li class="chapter-item expanded "><a href="16_streams/index.html"><strong aria-hidden="true">13.</strong> Streams</a></li><li class="chapter-item expanded "><a href="17_a_star/index.html"><strong aria-hidden="true">14.</strong> Search algorithms (draft)</a></li><li class="chapter-item expanded "><a href="17_exceptions/index.html"><strong aria-hidden="true">15.</strong> Exceptions</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="18_checked_unchecked/index.html"><strong aria-hidden="true">15.1.</strong> Checked and unchecked exceptions</a></li><li class="chapter-item expanded "><a href="19_finally/index.html"><strong aria-hidden="true">15.2.</strong> finally</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="contributors.html">Contributors</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
