#!/bin/bash

# Start
echo "Installing LaTeX ..."

# Install LaTeX
sudo apt-get install texlive-full -y

# Install convert
sudo apt-get install imagemagick -y

# Done
echo "LaTeX installed successfully"
