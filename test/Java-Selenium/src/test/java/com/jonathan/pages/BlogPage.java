package com.jonathan.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BlogPage {
	WebDriver driver;
	WebDriverWait wait;
	
	public BlogPage(WebDriver driver)
	{
		this.driver = driver;
		PageFactory.initElements(this.driver, this);
		wait = new WebDriverWait(driver, 15);
	}

	
	// Elements
	
	// Methods
	public boolean validTitle(String expectedTitle)
	{
		String actualTitle = driver.getTitle();
		if (actualTitle.equalsIgnoreCase(expectedTitle))
			return true;
		else
			return false;
	}

}
