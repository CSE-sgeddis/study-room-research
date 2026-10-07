#ifndef TREE_H
#define TREE_H

template<typename T>
struct BST_Node {
T val;
BST_Node* left;
BST_Node* right;

BST_Node(T v) : val(v),left(nullptr),right(nullptr)
{}

void insert(T v) {
    if(v>val){
        if (right==nullptr) right = new BST_Node<T>(v);
        else right->insert(v);
    }
    else{
        if (left==nullptr) left = new BST_Node<T>(v);
        else left->insert(v);
    }
}

};


template<typename T>
void delete_tree(BST_Node<T>* root){
    if (root==nullptr) return;
    delete_tree(root->left);
    delete_tree(root->right);
    delete root;
}


//your work starts here
template<typename T>
int num_nodes(BST_Node<T>* root){
    if(root == NULL)
        return 0;

    return 1 + num_nodes(root->left) + num_nodes(root->right);
}


template<typename T>
bool has_duplicate_val(BST_Node<T>* root){
    if(root == NULL)
        return false;

    if(root->left != NULL && root->left->val == root->val)
        return true;
    return has_duplicate_val(root->left) ||
           has_duplicate_val(root->right);
}


template<typename T>
bool trees_identical(BST_Node<T>* a, BST_Node<T>* b){
    if(a == NULL && b == NULL)
        return true;

    if(a == NULL || b == NULL)
        return false;

    return a->val == b->val &&
            trees_identical(a->left, b->left) &&
            trees_identical(a->right, b->right);
}



#endif //TREE_H
