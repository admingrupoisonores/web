// Copyright 2024 Alexandre D. Díaz - Grupo Isonor
odoo.define("web_reference_domain.relational_fields", function (require) {
    "use strict";

    const relational_fields = require("web.relational_fields");
    const Domain = require("web.Domain");


    relational_fields.FieldMany2One.include({
        /**
         * @override
         */
        init: function () {
            this._super(...arguments);
            this.isReferenceField = this.field.type === 'reference';
        },

        /**
         * Gets the domain for the selected model
         *
         * @returns {Array}
         */
        _getReferenceDomain: function () {
            if (Object.hasOwn(this.attrs, 'domain_map')) {
                const domain_map = py.eval(this.attrs.domain_map, this.getParent()?.state?.evalContext || {});
                if (Object.hasOwn(domain_map, this.modelName)) {
                    return domain_map[this.modelName];
                }
            }
            return [];
        },

        /**
         * @override
         */
        _search: async function () {
            // See why this is necessary in the 'basic_model.js' file
            if (this.isReferenceField) {
                this.recordParams.referenceDomain = this._getReferenceDomain();
            }
            return this._super(...arguments);
        },

        /**
         * @override
         */
        _getSearchCreatePopupOptions: function() {
            const res = this._super(...arguments);
            if (this.isReferenceField) {
                res.domain = this._getReferenceDomain();
            }
            return res;
        },
    });
});
