import { NgModule } from '@angular/core';

import { SearchTreeComponent } from './search-tree.component';
import { TreeComponent } from './tree.component';
import { treeNodeComponent } from './tree-node.component'


@NgModule({
    imports: [

    ],
    declarations: [
        SearchTreeComponent,
        TreeComponent,
        treeNodeComponent
    ],
    exports: [
      TreeComponent,
      SearchTreeComponent
    ]
})
export class TreeModule { }
